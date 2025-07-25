// backend/controllers/usersController.js
import pool from "../db.js"; // Asegúrate de que la ruta sea correcta para tu pool de conexión
import bcrypt from "bcryptjs"; // Para hashear contraseñas
import { JWT_SECRET } from "../config/config.js"; // Para cualquier lógica JWT si fuera necesaria aquí

export const usersController = {
  /**
   * @description: Crea un nuevo usuario. Solo accesible por administradores.
   * @route POST /api/users
   * @access Private (Admin)
   */
createUser: async (req, res) => {
    const { email, password, rol } = req.body;

    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || !rol) {
    return res
        .status(400)
        .json({ message: "Email, contraseña y rol son obligatorios." });
    }

    if (!emailRegex.test(email)) {
    return res
        .status(400)
        .json({ message: "El formato del correo electrónico es inválido." });
    }

    // Validación de rol: solo permitir 'admin' o 'usuario' (ajusta según tus roles)
    const allowedRoles = ["admin", "usuario"]; // Define los roles permitidos
    if (!allowedRoles.includes(rol)) {
    return res.status(400).json({
        message: `Rol inválido. Los roles permitidos son: ${allowedRoles.join(", ")}.`,
    });
    }

    try {
    
        const checkUserQuery = "SELECT id_usuario FROM usuarios WHERE email = $1";
        const existingUser = await pool.query(checkUserQuery, [email]);

    if (existingUser.rows.length > 0) {
        return res
        .status(409)
        .json({ message: "El correo electrónico ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
                INSERT INTO usuarios (email, password_hash, rol)
                VALUES ($1, $2, $3)
                RETURNING id_usuario, email, rol;
            `;
    const newUserResult = await pool.query(insertUserQuery, [
        email,
        hashedPassword,
        rol,
    ]);
    const newUser = newUserResult.rows[0];

    res
        .status(201)
        .json({ message: "Usuario creado exitosamente", user: newUser });
    } catch (error) {
    console.error("Error al crear usuario:", error);
    res
        .status(500)
        .json({ message: "Error interno del servidor al crear el usuario." });
    }
},

/**
   * @description: Actualiza un usuario existente por ID. Solo accesible por administradores.
   * @route PUT /api/users/:id
   * @access Private (Admin)
   */
updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, password, rol } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    // Validaciones básicas
    if (!email && !password && !rol) {
    return res.status(400).json({
        message:
        "Se debe proporcionar al menos un campo para actualizar (email, password o rol).",
    });
    }

    if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res
        .status(400)
        .json({ message: "El formato del correo electrónico es inválido." });
    }
    updates.push(`email = $${paramIndex++}`);
    values.push(email);
    }

    if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push(`password_hash = $${paramIndex++}`);
    values.push(hashedPassword);
    }

    if (rol) {
    const allowedRoles = ["admin", "usuario"];
    if (!allowedRoles.includes(rol)) {
        return res.status(400).json({
        message: `Rol inválido. Los roles permitidos son: ${allowedRoles.join(", ")}.`,
        });
    }
    updates.push(`rol = $${paramIndex++}`);
    values.push(rol);
    }

    if (updates.length === 0) {
    return res.status(400).json({
        message: "No se proporcionaron campos válidos para actualizar.",
    });
    }

    values.push(id); // El ID siempre es el último parámetro

    try {
    const updateUserQuery = `
                UPDATE usuarios
                SET ${updates.join(", ")}
                WHERE id_usuario = $${paramIndex}
                RETURNING id_usuario, email, rol;
            `;
    const result = await pool.query(updateUserQuery, values);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({
        message: "Usuario actualizado exitosamente",
        user: result.rows[0],
    });
    } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
        message: "Error interno del servidor al actualizar el usuario.",
    });
    }
},

/**
   * @description: Obtiene todos los usuarios. Solo accesible por administradores.
   * @route GET /api/users
   * @access Private (Admin)
   */
getAllUsers: async (req, res) => {
    try {
    const result = await pool.query(
        "SELECT id_usuario, email, rol FROM usuarios ORDER BY email ASC",
    );
    res.status(200).json(result.rows);
    } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
        .status(500)
        .json({ message: "Error interno del servidor al obtener usuarios." });
    }
},

/**
   * @description: Obtiene un usuario por ID. Solo accesible por administradores.
   * @route GET /api/users/:id
   * @access Private (Admin)
   */
getUserById: async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
        "SELECT id_usuario, email, rol FROM usuarios WHERE id_usuario = $1",
        [id],
        );
        if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res
        .status(500)
        .json({ message: "Error interno del servidor al obtener el usuario." });
    }
},

/**
   * @description: Elimina un usuario por ID. Solo accesible por administradores.
   * @route DELETE /api/users/:id
   * @access Private (Admin)
   */
deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
    const result = await pool.query(
        "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario;",
        [id],
    );
    if (result.rows.length === 0) {
        return res
        .status(404)
        .json({ message: "Usuario no encontrado para eliminar." });
    }
    res.status(200).json({
        message: "Usuario eliminado exitosamente",
        id_usuario: result.rows[0].id_usuario,
    });
    } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
        message: "Error interno del servidor al eliminar el usuario.",
    });
    }
},
};
