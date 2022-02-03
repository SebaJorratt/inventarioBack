const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.get = (req, res)=>{
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select nomUsuario, correo FROM usuario WHERE corrUsuario = ?',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
}