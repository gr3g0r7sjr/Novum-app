// backend/src/routes/vacantesRoutes.js
import { Router } from 'express';
import { obtenerVacantes, crearVacante } from '../controllers/vacantesController.js'; // Subimos un nivel para entrar a controllers

const router = Router();

router.get('/vacantes', obtenerVacantes);
router.post('/vacantes', crearVacante);

export default router;