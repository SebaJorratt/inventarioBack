const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

exports.login = (req, res)=>{
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * FROM usuario WHERE correo = ?',[req.body.correo],(err, rows)=>{
            if(err) return res.send(err)
            else if(rows.length > 0){
                const data = rows;
                if(!bcrypt.compareSync(req.body.password,data[0].password)){
                    return res.status(400).json({
                        mensaje: 'Contraseña Incorrecta'
                    })
                }else{
                    // Generar Token ( 
                    let token = jwt.sign({
                        data: rows
                    }, 'junjiInventario', { expiresIn: 60 * 60 * 24 * 30}) // Expira en 1 Mes
                    res.json({
                        data,
                        token
                    });
                }
            }
            else{
                return res.status(400).json({
                    mensaje: 'El email ingresado es incorrecto'
                })
            }
        })
    })
}
