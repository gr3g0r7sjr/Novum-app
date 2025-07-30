import express from "express";
const router = express.Router();
import {candidatosController} from "../controllers/candidatosController.js"; // Asegúrate de que la ruta sea correcta

// Ruta para obtener todos los candidatos
// GET /api/candidatos
router.get('/por-vacante-con-match', candidatosController.getCandidatosPorVacanteConMatch);

// Ruta para obtener un candidato por ID
// GET /api/candidatos/:id
router.get('/:id', candidatosController.getCandidatoById);

// Ruta para obtener todos los candidatos
// GET /api/candidatos
// Esta ruta puede ir aquí o al principio, ya que no tiene parámetros de URL que puedan entrar en conflicto.
router.get('/', candidatosController.getCandidatos);

// Ruta para crear un nuevo candidato
// POST /api/candidatos
router.post('/', candidatosController.createCandidato);

// Ruta para actualizar un candidato por ID
// PUT /api/candidatos/:id
router.put('/:id', candidatosController.updateCandidato);

// Ruta para eliminar un candidato por ID
// DELETE /api/candidatos/:id
router.delete('/:id', candidatosController.deleteCandidato);


export default router; // Usa export default para ES6