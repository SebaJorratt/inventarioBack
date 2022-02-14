const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.delete = (req, res)=>{
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('delete FROM usuario WHERE corrUsuario = ?',req.params.id,(err, rows)=>{
            if(err){
                return res.status(401).json({
                    mensaje: 'Error en el sistema',
                })
            }
            res.json(rows)
        })
    })
}