import express from 'express'
import registerController from './registerController'
import actualizaUserController from './actualizaUserController'
import obtenerDatos from './obtenerDatosController'
import loginController from './loginController'
import actualizaUsuario from './actualizaUsuario'
import eliminaUsuario from './deleteUsuario'
import obtenerUsuarios from './obtenerUsuarios'
import { verificarAuth } from '../middlewares/autenticacion'
import { verificarAdmin } from '../middlewares/autenticacion'

const router = express.Router();

router.put('/actualizaUser', verificarAuth, actualizaUserController.put)
router.get('/obtenerDatos', verificarAuth, obtenerDatos.get)
router.post('/login', loginController.login)

router.post('/register', verificarAuth, verificarAdmin, registerController.register)
router .put('/actualizaUsuario/:id', verificarAuth, verificarAdmin, actualizaUsuario.put)
router.get('/obtenUsuario/:id', verificarAuth, verificarAdmin, obtenerDatos.getUsuario)
router.delete('/eliminaUsuario/:id', verificarAuth, verificarAdmin, eliminaUsuario.delete)
router.get('/obtenerUsuarios', verificarAuth, verificarAdmin, obtenerUsuarios.get)

module.exports = router;