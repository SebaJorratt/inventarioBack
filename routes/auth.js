import express from 'express'
import registerController from './registerController'
import actualizaUserController from './actualizaUserController'
import obtenerDatos from './obtenerDatosController'
import loginController from './loginController'
import { verificarAuth } from '../middlewares/autenticacion'
import { verificarAdmin } from '../middlewares/autenticacion'

const router = express.Router();

router.post('/register', verificarAuth, verificarAdmin, registerController.register)
router.put('/actualizaUser/:id', verificarAuth, actualizaUserController.put)
router.get('/obtenerDatos/:id', verificarAuth, obtenerDatos.get)
router.post('/login', loginController.login)

module.exports = router;