
function UsuarioValidate(data, next){
    if(typeof data.nomUsuario !== 'string'){
        throw new Error('El nombre debe contener solo letras')
    }
    if(data.nomUsuario.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
    }
    if(!/^[a-z]+$/i.test(data.nomUsuario)){
        throw new Error('El nombre debe tener valores de la [a-z]')
    }
    if(data.password.length < 6){
        throw new Error('La contraseña debe tener un minimo de 6 caracteres')
    }
    if(typeof data.correo !== 'string'){
        throw new Error('El correo debe contener solo letras')
    }
    if(!/^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i.test(data.correo)){
        throw new Error('El formato del correo es erroneo')
    }
}

module.exports = {UsuarioValidate};