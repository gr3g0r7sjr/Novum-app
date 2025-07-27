import { Router } from "express";
import { vacantesController } from "../controllers/vacantesController.js";

const router = Router();


// GET: Obtiene todas las vacantes activas.
router.get("/", vacantesController.obtener);

// POST: Crea una nueva vacante.
router.post("/", vacantesController.crear);

// PUT: Actualiza una vacante existente por su ID.
// Usa ':id' para identificar la vacante a actualizar.
router.put("/:id", vacantesController.actualizar);

// DELETE: Elimina una vacante por su ID.
// Usa ':id' para identificar la vacante a eliminar.
router.delete("/", vacantesController.eliminar);

router.get("/servicios-interes", vacantesController.obtenerServiciosInteres);

export default router;
