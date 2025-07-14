// backend/src/routes/vacantesRoutes.js
import { Router } from 'express';
import { vacantesController } from '../controllers/vacantesController.js'; // Subimos un nivel para entrar a controllers

const router = Router();

router.get('/vacantes', vacantesController.obtener);
router.post('/vacantes', vacantesController.crear);

export default router;