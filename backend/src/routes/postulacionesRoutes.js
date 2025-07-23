// backend/routes/postulacionesRoutes.js
import express from 'express';
const router = express.Router();
import {postulacionesController} from '../controllers/postulacionesController.js'; // Importa las funciones del controlador con la extensión .js

// Rutas para la funcionalidad de postulación
router.post('/', postulacionesController.aplicarVacantes);
router.get('/', postulacionesController.getPostulaciones); 

export default router; // Exporta el router usando export default