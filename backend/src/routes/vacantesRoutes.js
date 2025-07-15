import express from 'express';
import { crearVacante } from '../controllers/vacantesController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Definimos la ruta para crear una vacante.
// POST /api/vacantes
// Esta ruta está protegida y requiere autenticación y un rol específico.
// 1. 'protect': Verifica que el token JWT sea válido y extrae los datos del usuario.
// 2. 'checkRole('administrador')': Verifica que el rol del usuario sea 'administrador'.
//    Puedes cambiar 'administrador' por otro rol si lo necesitas (ej. 'recursos_humanos').
// 3. 'crearVacante': Es el controlador que finalmente procesa la solicitud.

router.post('/vacantes', protect, checkRole('administrador'), crearVacante);

export default router;
