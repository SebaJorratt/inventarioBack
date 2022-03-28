import express from 'express'
import { verificarAuth, verificarAdmin } from '../middlewares/autenticacion';
const router = express.Router();
const validations = require('../middlewares/validations')

//Todas las rutas de POST
//Agregar una ubicacion
router.post('/agregaUbicacion', verificarAuth, (req,res) => {
    validations.UbicacionValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ubicacion (comuna, provincia, region) VALUES (?,?,?)',[req.body.comuna, req.body.provincia, req.body.region], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar una Marca
router.post('/agregaMarca', verificarAuth, (req,res) => {
    validations.MarcaValidate(req.body)
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO marca (nomMarca) VALUES (?)',[req.body.nomMarca], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Tipo
router.post('/agregaTipo', verificarAuth, (req,res) => {
    validations.TipoValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT Into tipo (tipoEquipo) VALUES (?)',[req.body.tipoEquipo], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Funcionario
router.post('/agregaFuncionario', verificarAuth, (req,res) => {
    validations.FuncionarioValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        console.log(req.body.nombre)
        conn.query('INSERT INTO funcionario (codigo, nombre, codFuncionario, correo, rut, codJardin, encargado) VALUES (?, ?, ?, ?, ?, ?, ?)',[req.body.codigo, req.body.nombre, req.body.codFuncionario, req.body.correo, req.body.rut, req.body.codJardin, req.body.encargado], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar una Dependencia
router.post('/agregaDependencia', verificarAuth, (req,res) => {
    validations.DependenciaValidate(req.body)
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO dependencia (codJardin, nomJardin, division, numUbicacion) VALUES ((?), (?), (?), (Select numUbicacion From ubicacion Where region = ? and comuna = ? and provincia = ?))',[req.body.codJardin, req.body.nomJardin, 'division', req.body.region, req.body.comuna, req.body.provincia], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Equipo
router.post('/agregaEquipo', verificarAuth, (req,res) => {
    validations.EquipoValidate(req.body)
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO equipo (codEquipo, modelo, serie, codTipo, codMarca, estado, condicion, VA, compañia, pulgadas, MAC, procesador, RAM, discoDuro, IMEI, capacidad, lumenes) VALUES ((?), (?), (?), (Select codTipo From tipo Where tipoEquipo = ?), (Select codMarca From marca Where nomMarca = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[req.body.codEquipo, req.body.modelo, req.body.serie, req.body.tipoEquipo, req.body.nomMarca, req.body.estado, req.body.condicion, req.body.va, req.body.compañia, req.body.pulgadas, req.body.mac, req.body.procesador, req.body.ram, req.body.discoDuro, req.body.imei, req.body.capacidad, req.body.lumenes], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Historial
router.post('/agregaHistorial', verificarAuth, (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO historial (estado, zona, codigo, codJardin, corrEquipo, fechaInicio) VALUES ((?), (?), (Select f.codigo From funcionario f Where f.nombre = ?), (Select d.codJardin From dependencia d Where d.nomJardin = ?), (?), (?));',[true, req.body.zona, req.body.nombre, req.body.nomJardin, req.body.corrEquipo, req.body.fechaInicio], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//TODAS LAS RUTAS GET
//PRIMERA VISTA
//Desplegar a los equipos que actualmente tienen un dueño

router.get('/equiposConDueno', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.corrEquipo, t.tipoEquipo, e.serie, e.estado, e.codEquipo, d.nomJardin, d.codJardin, f.nombre, h.zona, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio From equipo as e Left Join historial as h ON h.corrEquipo = e.corrEquipo Left Join tipo as t ON t.codTipo = e.codTipo Left Join dependencia as d ON d.codJardin = h.codJardin Left Join funcionario as f ON f.codigo = h.codigo Where h.estado = true;','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Desplegar a los equipos que actualmente no tienen un dueño
router.get('/equiposSinDueno', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select e.corrEquipo, t.tipoEquipo, e.serie, e.codEquipo, m.nomMarca, e.modelo From equipo as e Left Join marca as m ON e.codMarca = m.codMarca Left Join tipo as t ON e.codTipo = t.codTipo Where e.corrEquipo NOT IN (Select corrEquipo FRom historial Where estado=true) and e.estado != "Baja"','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Desplegar a los equipos que actualmente estan dados de baja
router.get('/equiposBaja', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select e.corrEquipo, t.tipoEquipo, e.serie, e.codEquipo, m.nomMarca, e.modelo From equipo as e Left Join marca as m ON e.codMarca = m.codMarca Left Join tipo as t ON e.codTipo = t.codTipo Where e.estado = "Baja"','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener datos de un equipo con la id del equipo
router.get('/datosEqp/:id', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select e.corrEquipo, e.codEquipo, e.modelo, t.tipoEquipo, t.codTipo, e.serie, m.nomMarca, e.estado, e.condicion, e.VA, e.compañia, e.pulgadas, e.MAC, e.procesador, e.RAM, e.discoDuro, e.IMEI, e.capacidad, e.lumenes From equipo e, tipo t, marca m Where e.corrEquipo = ? and e.codMarca = m.codMarca and e.codTipo = t.codTipo',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener datos de equipo en base a su codigo
router.get('/datosEqpCodigo/:codigo', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select e.codEquipo, e.modelo, t.tipoEquipo, e.serie, m.nomMarca, e.estado, e.condicion From equipo e, tipo t, marca m Where e.codEquipo = ? and e.codMarca = m.codMarca and e.codTipo = t.codTipo',req.params.codigo,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener datos de equipo en base a su serie
router.get('/datosEqpSerie/:serie', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select e.codEquipo, e.modelo, t.tipoEquipo, e.serie, m.nomMarca, e.estado, e.condicion From equipo e, tipo t, marca m Where e.serie = ? and e.codMarca = m.codMarca and e.codTipo = t.codTipo',req.params.serie,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//OBTENER DIFERENTES ENTIDADES DE LA BASE DE DATOS
//Obtener Regiones
router.get('/regiones', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT region FROM ubicacion','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener Provincias
router.get('/provincias/:region', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT provincia FROM ubicacion Where region = ?',req.params.region,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener Comunas
router.get('/comunas/:provincia', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select DISTINCT comuna FROM ubicacion Where provincia = ?',req.params.provincia,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener Tipos de Equipos
router.get('/tipos', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select tipoEquipo, codTipo FROM tipo','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener Marcas
router.get('/marcas', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select nomMarca FROM marca','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener Funcionarios
router.get('/funcionarios', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * From funcionario','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener un funcionario desde la tabla para Editarlo
router.get('/funcionario/:codigo', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * From funcionario where codigo = ?',req.params.codigo,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener el historial de un funcionario
router.get('/Histfuncionario/:codigo', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.codEquipo, t.tipoEquipo, e.serie, e.modelo, m.nomMarca, d.nomJardin, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio, h.zona FROM funcionario as f Left Join historial as h ON h.codigo = f.codigo Left Join equipo as e ON e.corrEquipo = h.corrEquipo Left Join dependencia as d ON d.codJardin = h.codJardin Left Join tipo as t ON t.codTipo = e.codTipo Left Join marca as m ON m.codMarca = e.codMarca Where h.estado = false and f.codigo = ?',req.params.codigo,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener los equipos Actuales de un funcionario
router.get('/Actfuncionario/:codigo', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.codEquipo, t.tipoEquipo, e.serie, e.modelo, m.nomMarca, d.nomJardin, h.zona, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio FROM funcionario as f Left Join historial as h ON h.codigo = f.codigo Left Join equipo as e ON e.corrEquipo = h.corrEquipo Left Join dependencia as d ON d.codJardin = h.codJardin Left Join tipo as t ON t.codTipo = e.codTipo Left Join marca as m ON m.codMarca = e.codMarca Where h.estado = true and f.codigo = ?',req.params.codigo,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener dependencias
router.get('/dependencias', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select * From dependencia','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener dependencias
router.get('/dependenciasTabla', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select d.codJardin, d.nomJardin, u.region, u.provincia, u.comuna From dependencia as d LEFT JOIN ubicacion as u ON d.numUbicacion = u.numUbicacion','',(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener una dependencia desde la tabla para Editarla
router.get('/dependencia/:codJardin', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select d.nomJardin, u.region, u.comuna, u.provincia From dependencia d, ubicacion u where codJardin = ? and u.numUbicacion = d.numUbicacion',req.params.codJardin,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener el historial de una dependencia
router.get('/Histdependencia/:codJardin', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.codEquipo, t.tipoEquipo, e.serie, e.modelo, m.nomMarca, f.nombre, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio, h.zona From dependencia as d Left Join historial as h ON h.codJardin = d.codJardin Left Join funcionario as f ON f.codigo = h.codigo Left Join equipo as e ON e.corrEquipo = h.corrEquipo Left Join tipo as t ON t.codTipo = e.codTipo Left Join marca as m ON m.codMarca = e.codMarca Where h.estado = false and d.codJardin = ?',req.params.codJardin,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener el historial de un equipo
router.get('/HistEquipo/:id', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.codEquipo, h.zona, d.nomJardin, f.nombre, DATE_FORMAT(h.fecha,"%d/%m/%y") as fecha, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio From historial as h left join dependencia as d On d.codJardin = h.codJardin left join funcionario as f on f.codigo = h.codigo left join equipo as e on e.corrEquipo = h.corrEquipo Where e.corrEquipo = ? and h.estado = 0;',req.params.id,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Obtener equipos Actuales de una dependencia
router.get('/Actdependencia/:codJardin', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, e.codEquipo, t.tipoEquipo, e.serie, e.modelo, m.nomMarca, f.nombre, h.zona, DATE_FORMAT(h.fechaInicio,"%d/%m/%y") as fechaInicio From dependencia as d Left Join historial as h ON h.codJardin = d.codJardin Left Join funcionario as f ON f.codigo = h.codigo Left Join equipo as e ON e.corrEquipo = h.corrEquipo Left Join tipo as t ON t.codTipo = e.codTipo Left Join marca as m ON m.codMarca = e.codMarca Where h.estado = true and d.codJardin = ?',req.params.codJardin,(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})


//PUT Actualizar Datos
//Obtener equipos Actuales de una dependencia
router.put('/actualizaEquipo/:idEquipo', verificarAuth, (req, res) => {
    validations.EquipoValidate(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update equipo Set codEquipo = ?, modelo = ?, serie = ?, estado = ?, condicion = ?, codTipo = (Select codTipo From tipo Where tipoEquipo = ?), codMarca = (Select codMarca From marca Where nomMarca = ?), VA = ?, compañia = ?, pulgadas = ?, MAC = ?, procesador = ?, RAM = ?, discoDuro = ?, IMEI = ?, capacidad = ?, lumenes = ? Where corrEquipo = ?',[req.body.codEquipo, req.body.modelo, req.body.serie, req.body.estado, req.body.condicion, req.body.tipoEquipo, req.body.nomMarca, req.body.va, req.body.compañia, req.body.pulgadas, req.body.mac, req.body.procesador, req.body.ram, req.body.discoDuro, req.body.imei, req.body.capacidad, req.body.lumenes, req.params.idEquipo],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Actualizar el estado del historial
router.put('/actualizaHistorial/:id', verificarAuth, verificarAdmin, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update historial Set estado = false, fecha = ? Where codHistorial = ?',[req.body.fecha, req.params.id],(err, rows)=>{
            if(err) return res.send(err)
            res.json(req.params.id)
        })
    })
})

//Actualiza la zona de un historial
router.put('/actualizaZona/:id', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update historial Set zona = ? Where codHistorial = ?',[req.body.zona, req.params.id],(err, rows)=>{
            if(err) return res.send(err)
            res.json(req.params.id)
        })
    })
})

//Actualizar un funcionario
router.put('/actualizaFuncionario/:codigo', verificarAuth, (req, res) => {
    validations.FuncionarioValidate(req.body)
    console.log(req.body)
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update funcionario Set codFuncionario = ?, nombre = ?, correo = ?, rut = ?, codJardin = ?, encargado = ? Where codigo = ?',[req.body.codFuncionario, req.body.nombre, req.body.correo, req.body.rut, req.body.codJardin, req.body.encargado, req.params.codigo],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Editar dependencia
router.put('/actualizaDependencia/:codJardin', verificarAuth, (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Update dependencia Set nomJardin = ?, numUbicacion = (Select numUbicacion From ubicacion Where region = ? and comuna = ? and provincia = ?) Where codJardin = ?',[req.body.nomJardin, req.body.region, req.body.comuna, req.body.provincia, req.params.codJardin],(err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

router.use((error, req, res, next) => {
    res.status(400).json({
      status: 'error',
      message: error.message,
    })
})

module.exports = router;