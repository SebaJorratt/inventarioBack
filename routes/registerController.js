const bcrypt = require('bcrypt');
const saltRounds = 10;

const validations = require('../middlewares/validations')

exports.register = (req, res)=>{
    validations.UsuarioValidate(req.body)
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
                return res.status(400).json({
                    mensaje: 'Este email ya se encuentra en uso'
                })
            }
            else{
                req.getConnection((err, conn) => {
                    if(err) return res.send(err)
                    conn.query('SELECT nomUsuario FROM usuario WHERE nomUsuario = ?',nomUsuario,(err, rows)=>{
                        if(err){
                            return res.status(400).json({
                                mensaje: 'Error del sistema'
                            })
                        }
                        else if(rows.length > 0){
                            return res.status(400).json({
                                mensaje: 'Este nombre de usuario ya se encuentra en uso'
                            })
                        }
                        else{
                            req.getConnection((err, conn) => {
                                if(err) return res.send(err)
                                conn.query('INSERT INTO usuario (nomUsuario, correo, password, tipoUsuario) VALUES (?, ?, ?, ?)',[nomUsuario, correo, password, tipo],(err, rows)=>{
                                    if(err){
                                        return res.status(400).json({
                                            mensaje: 'Error del sistema al añadir a un nuevo Usuario'
                                        })
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