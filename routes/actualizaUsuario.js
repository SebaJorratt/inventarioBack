const bcrypt = require('bcrypt');
const saltRounds = 10;

const validations = require('../middlewares/validations')

exports.put = (req, res)=>{
    validations.PutUsuarioSinContra(req.body)
    const corrUsuario = req.params.id; 
    const nomUsuario = req.body.nomUsuario;
    const correo = req.body.correo;

    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('SELECT correo FROM usuario WHERE correo = ? and corrUsuario != ? ',[correo, corrUsuario],(err, rows)=>{
            if(err){
                return res.status(401).json({
                    mensaje: 'Error en el sistema',
                })
            }
            else if(rows.length > 0){
                return res.status(400).json({
                    mensaje: 'Correo ya existente en el sistema',
                })
            }
            else{
                req.getConnection((err, conn) => {
                    if(err) return res.send(err)
                    conn.query('SELECT nomUsuario FROM usuario WHERE nomUsuario = ? and corrUsuario != ? ',[nomUsuario, corrUsuario],(err, rows)=>{
                        if(err){
                            return res.send(err)
                        }
                        else if(rows.length > 0){
                            return res.status(400).json({
                                mensaje: 'Usuario ingresado ya existe en el sistema porfavor intente con otro nombre',
                            })
                        }
                        else{
                            if(req.body.password){
                                validations.PutContraseña(req.body)
                                const password = req.body.password
                                const newPassword = bcrypt.hashSync(req.body.newPassword, saltRounds);
                                req.getConnection((err, conn) => {
                                    if(err) return res.send(err)
                                    conn.query('SELECT * FROM usuario WHERE corrUsuario = ? ',[corrUsuario],(err, rows)=>{
                                        if(err){
                                            return res.status(400).json({
                                                mensaje: 'Error en el sistema',
                                            })
                                        }
                                        else if(rows.length > 0){
                                            const data = rows;
                                            console.log(rows)
                                            if(bcrypt.compareSync(password, data[0].password)){
                                                req.getConnection((err, conn) => {
                                                    if(err){
                                                        return res.status(400).json({
                                                            mensaje: 'Error en el sistema',
                                                        })
                                                    }
                                                    conn.query('Update usuario SET nomUsuario = ?, correo = ?, password = ? Where corrUsuario = ?',[nomUsuario, correo, newPassword, corrUsuario],(err, rows)=>{
                                                        if(err) return res.send(err)
                                                        res.json(rows)
                                                    })
                                                })
                                            }
                                            else{
                                                return res.status(400).json({
                                                    mensaje: 'Contraseña Invalida',
                                                })
                                            }
                                        } else{
                                            return res.status(400).json({
                                                mensaje: 'Usuario no encontrado error en el sistema',
                                            })
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