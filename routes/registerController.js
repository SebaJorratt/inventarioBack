const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.register = (req, res)=>{
    const nomUsuario = req.body.nomUsuario;
    const correo = req.body.correo;
    const password = bcrypt.hashSync(req.body.password, saltRounds);
    const tipo = req.body.tipo;
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT correo FROM usuario WHERE correo = ?',correo,(err, rows)=>{
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
                    conn.query('SELECT nomUsuario FROM usuario WHERE nomUsuario = ?',nomUsuario,(err, rows)=>{
                        if(err){
                            return res.send(err)
                        }
                        else if(rows.length > 0){
                            err = 'El nombre de usuario ingresado ya existe';
                            return res.send(err)
                        }
                        else{
                            req.getConnection((err, conn) => {
                                if(err) return res.send(err)
                                conn.query('INSERT INTO usuario (nomUsuario, correo, password, tipoUsuario) VALUES (?, ?, ?, ?)',[nomUsuario, correo, password, tipo],(err, rows)=>{
                                    if(err){
                                        console.log(err)
                                        return err;
                                    }
                                    res.json(rows)
                                })
                            })
                        }
                    })
                })
            }
        })
    })

    
}