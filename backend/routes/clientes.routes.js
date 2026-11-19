import { Router } from 'express'
import { datosMiCuenta, iniciarSesionCliente, registrarCliente } from '../controllers/clientes.controller.js'
import { limitarPeticiones } from '../middleware/limitarPeticiones.js'
import { verificarCliente } from '../middleware/verificarCliente.js'

const router = Router()

// Protecciones independientes del asistente; se reinician al reiniciar Node.
router.post('/registro', limitarPeticiones({ maximo: 6, ventanaMs: 60 * 60 * 1000 }), registrarCliente)
router.post('/login', limitarPeticiones({ maximo: 10, ventanaMs: 15 * 60 * 1000 }), iniciarSesionCliente)
router.get('/yo', verificarCliente, datosMiCuenta)

export default router
