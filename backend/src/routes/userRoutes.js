// backend/routes/userRoutes.js
import express from "express";
import { usersController } from "../controllers/userController.js"; // Asegúrate de la ruta correcta
import authenticateToken from "../middlewares/authMiddleware.js"; // Tu middleware de autenticación
import authorizeRole from "../middlewares/roleMiddleware.js"; // El nuevo middleware de autorización

const router = express.Router();

// Todas estas rutas requieren autenticación y el rol de 'admin'

// Crear un nuevo usuario
router.post("/",authenticateToken, authorizeRole("admin"), usersController.createUser);

// Obtener todos los usuarios
router.get("/",authenticateToken, authorizeRole("admin"), usersController.getAllUsers);

// Obtener un usuario por ID
router.get("/:id",authenticateToken, authorizeRole("admin"),usersController.getUserById);

// Actualizar un usuario por ID
router.put("/:id",authenticateToken, authorizeRole("admin"), usersController.updateUser);

// Eliminar un usuario por ID
router.delete("/:id",authenticateToken, authorizeRole("admin"), usersController.deleteUser);

export default router;
