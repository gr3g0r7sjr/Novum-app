// backend/src/routes/vacantesRoutes.js
import { Router } from 'express';
import { obtenerVacantes, crearVacante } from '../controllers/vacantesController.js'; // Subimos un nivel para entrar a controllers

const router = Router();

router.get('/', obtenerVacantes);
router.post('/', crearVacante);

export default router;