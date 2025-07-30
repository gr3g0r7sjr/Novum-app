// backend/src/routes/dashboardRoutes.js
import express from 'express';
const router = express.Router();
import { getDashboardMetrics } from '../controllers/dashboardController.js'; // Importa la función del controlador
import authenticateToken from '../middlewares/authMiddleware.js'; // Asumiendo que esta es tu ruta al middleware

// Ruta para obtener todas las métricas del dashboard
// Esta ruta debería estar protegida para que solo usuarios autenticados (RRHH) puedan acceder.
router.get('/metrics', authenticateToken, getDashboardMetrics);

export default router;
