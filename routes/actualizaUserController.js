const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.put = (req, res)=>{
    const corrUsuario = req.params.id; 
    const nomUsuario = req.body.nomUsuario;
    const correo = req.body.correo;

    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT correo FROM usuario WHERE correo = ? and corrUsuario != ? ',[correo, corrUsuario],(err, rows)=>{
            if(err){
                return res.send(err)
            }
            else if(rows.length > 0){
                err = 'El email ingresado ya existe';
                return res.send(err)
            }
            else{
                req.getConnection((err, conn) => {
                    if(err) return res.send(err)
                    conn.query('SELECT nomUsuario FROM usuario WHERE nomUsuario = ? and corrUsuario != ? ',[nomUsuario, corrUsuario],(err, rows)=>{
                        if(err){
                            return res.send(err)
                        }
                        else if(rows.length > 0){
                            err = 'El usuario ingresado ya existe';
                            return res.send(err)
                        }
                        else{
                            if(req.body.password){
                                const password = req.body.password
                                const newPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
                                req.getConnection((err, conn) => {
                                    if(err) return res.send(err)
                                    conn.query('SELECT * FROM usuario WHERE corrUsuario = ? ',[corrUsuario],(err, rows)=>{
                                        if(err){
                                            return res.send(err)
                                        }
                                        else if(rows.length > 0){
                                            const data = rows;
                                            console.log(rows)
                                            if(bcrypt.compareSync(password, data[0].password)){
                                                req.getConnection((err, conn) => {
                                                    if(err) return res.send(err)
                                                    conn.query('Update usuario SET nomUsuario = ?, correo = ?, password = ? Where corrUsuario = ?',[nomUsuario, correo, newPassword, corrUsuario],(err, rows)=>{
                                                        if(err) return res.send(err)
                                                        res.json(rows)
                                                    })
                                                })
                                            }
                                            else{
                                                console.log('Contraseñas diferentes')
                                                err = 'Contraseñas diferentes';
                                                return res.send(err)
                                            }
                                        } else{
                                            err = 'El usuario no se ha encontrado error en el sistema'
                                            return res.send(err)
                                        }   
                                    })
                                })
                            }else{
                                req.getConnection((err, conn) => {
                                    if(err) return res.send(err)
                                    conn.query('Update usuario SET nomUsuario = ?, correo = ? Where corrUsuario = ?',[nomUsuario, correo, corrUsuario],(err, rows)=>{
                                        if(err) return res.send(err)
                                        res.json(rows)
                                    })
                                })
                            }
                            
                        }
                    })
                })
            }
        })
    })

}