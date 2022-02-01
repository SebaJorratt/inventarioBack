import express from 'express'
const router = express.Router();

//Todas las rutas de POST
//Agregar una ubicacion
router.post('/agregaUbicacion', (req,res) => {
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
        conn.query('INSERT INTO ubicacion (comuna, providencia, region) VALUES (?,?,?)',[req.body.comuna, req.body.provincia, req.body.region], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar una Marca
router.post('/agregaMarca', (req,res) => {
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
router.post('/agregaTipo', (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT Into tipo (tipoEquipo) VALUES (?)',[req.body.tipoEquipo], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Funcionario
router.post('/agregaFuncionario', (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO funcionario (codigo, nombre, codFuncionario, correo, rut) VALUES (?, ?, ?, ?, ?)',[req.body.codigo, req.body.nombre, req.body.codFuncionario, req.body.correo, req.body.rut], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar una Dependencia
router.post('/agregaDependencia', (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO dependencia (codJardin, nomJardin, division, codigo, numUbicacion) VALUES ((?), (?), (?), (Select codigo From funcionario Where nombre = ?), (Select numUbicacion From ubicacion Where region = ? and comuna = ? and providencia = ?))',[req.body.codJardin, req.body.nomJardin, 'division', req.body.nombre, req.body.region, req.body.comuna, req.body.provincia], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Equipo
router.post('/agregaEquipo', (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO equipo (codEquipo, modelo, serie, codTipo, codMarca, estado, condicion) VALUES ((?), (?), (?), (Select codTipo From tipo Where tipoEquipo = ?), (Select codMarca From marca Where nomMarca = ?), ?, ?)',[req.body.codEquipo, req.body.modelo, req.body.serie, req.body.tipoEquipo, req.body.nomMarca, req.body.estado, req.body.condicion], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//Agregar un Historial
router.post('/agregaHistorial', (req,res) => {
    req.getConnection((err, conn)=>{
        console.log(req.body.nomMarca)
        if(err) return res.send(err)
        conn.query('INSERT INTO historial (estado, zona, codigo, codJardin, corrEquipo) VALUES ((?), (?), (Select f.codigo From funcionario f Where f.nombre = ?), (Select d.codJardin From dependencia d Where d.nomJardin = ?), (?));',[true, req.body.zona, req.body.nombre, req.body.nomJardin, req.body.corrEquipo], (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

//TODAS LAS RUTAS GET
//PRIMERA VISTA
//Desplegar a los equipos que actualmente tienen un dueño

router.get('/equiposConDueño', (req, res) => {
    req.getConnection((err, conn) => {
        if(err) return res.send(err)
        conn.query('Select h.codHistorial, t.tipoEquipo, e.serie, e.codEquipo, d.nomJardin, d.codJardin, f.nombre, h.zona From historial h, tipo t, equipo e, dependencia d, funcionario f Where h.estado = true and h.codigo = f.codigo and h.codJardin = d.codJardin and h.corrEquipo = e.corrEquipo and e.codTipo = t.codTipo', (err, rows)=>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

module.exports = router;