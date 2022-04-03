
function UsuarioValidate(data, next){
    if(typeof data.nomUsuario !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomUsuario)){
        throw new Error('El nombre debe contener letras')
    }
    if(data.nomUsuario.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
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
    if(data.tipo !== 1 && data.tipo !==0 && data.tipo !=='0' && data.tipo !=='1'){
        throw new Error('Se ingreso un tipo diferente a los 2 existentes') 
    }
}

function PutUsuarioSinContra(data, next){
    if(typeof data.nomUsuario !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomUsuario)){
        throw new Error('El nombre debe contener letras')
    }
    if(data.nomUsuario.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
    }
    if(typeof data.correo !== 'string'){
        throw new Error('El correo debe contener solo letras')
    }
    if(!/^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i.test(data.correo)){
        throw new Error('El formato del correo es erroneo')
    }
}

function PutContraseña(data, next){
    if(data.password.length < 6){
        throw new Error('La contraseña debe tener un minimo de 6 caracteres')
    }
}

function TipoValidate(data, next){
    if(/^[0-9]+$/i.test(data.tipoEquipo)){
        throw new Error('El tipo del equipo solo debe contener texto')
    }
}

function MarcaValidate(data, next){
    if(/^[0-9]+$/i.test(data.nomMarca)){
        throw new Error('El nombre de la marca debe contener solo letras')
    }
}

function EquipoValidate(data, next){
    if(data.estado !== 'Bueno' && data.estado !== 'Regular' && data.estado !== 'Malo' && data.estado !== 'Baja'){
        throw new Error('Estado Ingresado Incorrectamente')
    }
    if(/^[0-9]+$/i.test(data.condicion)){
        throw new Error('La condición debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.compañia) && data.compañia !== null){
        throw new Error('La compañia debe contener letras')
    }
    if(!/^[0-9]+$/i.test(data.va) && data.va !== null){
        throw new Error('El va debe ser un valor numerico')
    }
    if(!/^[0-9]+$/i.test(data.pulgadas) && data.pulgadas !== null){
        throw new Error('Las pulgadas debe ser un valor numerico')
    }
    if(!/^[0-9]+$/i.test(data.ram) && data.ram !== null){
        throw new Error('La RAM debe ser un valor numerico')
    }
    if(!/^[0-9]+$/i.test(data.capacidad) && data.capacidad !== null){
        throw new Error('La Capacidad debe ser un valor numerico')
    }
    if(!/^[0-9]+$/i.test(data.lumenes) && data.lumenes !== null){
        throw new Error('Los lumenes debe tener un valor numerico')
    }
}

function FuncionarioValidate(data, next){
    if(typeof data.nombre !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nombre)){
        throw new Error('El nombre del funcionario debe contener letras')
    }
    if(data.nombre.length < 10){
        throw new Error('El nombre debe tener un minimo de 10 caracteres')
    }
    if(typeof data.correo !== 'string'){
        throw new Error('El correo debe contener solo letras')
    }
    if(!/^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i.test(data.correo)){
        throw new Error('El formato del correo es erroneo')
    }
    if(data.encargado !== 1 && data.encargado !==0){
        throw new Error('Se ingreso un tipo diferente a los 2 existentes') 
    }
}

function UbicacionValidate(data, next){
    if(typeof data.comuna !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.comuna)){
        throw new Error('El nombre del funcionario debe contener letras')
    }
    if(typeof data.provincia !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.provincia)){
        throw new Error('El nombre del funcionario debe contener letras')
    }
    if(typeof data.region !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.region)){
        throw new Error('El nombre del funcionario debe contener letras')
    }
}

function DependenciaValidate(data, next){
    if(typeof data.nomJardin !== 'string'){
        throw new Error('El nombre debe contener letras')
    }
    if(/^[0-9]+$/i.test(data.nomJardin)){
        throw new Error('El nombre del jardin debe contener letras')
    }
}



module.exports = {UsuarioValidate, PutUsuarioSinContra, PutContraseña, TipoValidate, MarcaValidate, EquipoValidate, FuncionarioValidate, UbicacionValidate, DependenciaValidate};