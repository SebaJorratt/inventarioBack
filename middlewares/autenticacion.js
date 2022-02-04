const jwt = require('jsonwebtoken');

const verificarAuth = (req,res,next) =>{
    const token = req.get('token');
    jwt.verify(token, 'junjiInventario',(err,decoded)=>{
        if(err){
            return res.status(401).json({
                mensaje: 'Usuario no valido',
            })
        }
        req.usuario = decoded.data
        next();
    })
}

const verificarAdmin = (req,res,next) =>{
    const rol = req.usuario[0].tipoUsuario
    if(rol === 1){
        next();
    }else{
        return res.status(401).json({
            mensaje: 'Usuario no valido para esta opción',
        })
    }
}

module.exports = {verificarAuth, verificarAdmin}