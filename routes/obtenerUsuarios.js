const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.get = (req, res)=>{
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select corrUsuario, nomUsuario, correo FROM usuario Where corrUsuario != ?', req.usuario[0].corrUsuario, (err, rows)=>{
            if(err){
                return res.status(401).json({
                    mensaje: 'Error en el sistema',
                })
            }
            res.json(rows)
        })
    })
}