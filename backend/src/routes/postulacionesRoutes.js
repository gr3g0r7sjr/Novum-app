// backend/routes/postulacionesRoutes.js
import express from 'express';
const router = express.Router();
import { aplicarVacante, getPostulaciones } from '../controllers/postulacionesController.js'; // Importa las funciones del controlador con la extensión .js

// Rutas para la funcionalidad de postulación
router.post('/', aplicarVacante); // POST /api/postulaciones (para aplicar a una vacante)
router.get('/', getPostulaciones); // GET /api/postulaciones (para obtener todas las postulaciones)

export default router; // Exporta el router usando export default