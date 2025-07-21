import { Router } from 'express';
import { vacantesController } from '../controllers/vacantesController.js'; // Subimos un nivel para entrar a controllers

const router = Router();

router.get('/', vacantesController.obtener);
router.post('/', vacantesController.crear);
router.get('/servicios-interes', vacantesController.obtenerServiciosInteres);
router.get('/', vacantesController.obtenerVacanteId)

export default router;