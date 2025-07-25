import pool from "../db.js"; // Importa tu pool de DB (asegúrate de que la ruta sea correcta)
import bcrypt from "bcryptjs"; // Importa bcrypt para comparar contraseñas
import jwt from "jsonwebtoken"; // Importa jsonwebtoken para crear el JWT
import { JWT_SECRET } from "../config/config.js"; // Importa tu clave secreta JWT desde config

export const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios.",
      });
    }

    try {
      const userQuery =
        "SELECT id_usuario, email, password_hash, rol FROM usuarios WHERE email = $1";
      const result = await pool.query(userQuery, [email]);

      const user = result.rows[0];

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Credenciales inválidas." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Credenciales inválidas." });
      }

      const token = jwt.sign(
        {
          id: user.id_usuario, // Usamos id_usuario de la DB
          email: user.email, // Usamos 'email' como lo tenías en la consulta
          rol: user.rol, // Incluimos el rol del usuario (asumiendo que se selecciona en la query)
        },
        JWT_SECRET, // Tu clave secreta para firmar el token
        { expiresIn: "1h" }, // El token expira en 1 hora (puedes ajustar esto)
      );

      // 6. Enviar el token y la información básica del usuario en la respuesta
      res.status(200).json({
        success: true,
        message: "Inicio de Sesión exitoso",
        token: token, // <-- El JWT se envía aquí
        user: {
          id: user.id_usuario, // Usamos id_usuario
          email: user.email, // Usamos 'email'
          rol: user.rol, // Incluimos el rol en la respuesta
        },
      });
    } catch (error) {
      console.error("Error en authController.login:", error); // Mensaje de error más descriptivo
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al intentar iniciar sesión.",
        error: error.message,
      });
    }
  },

  // Puedes añadir otras funciones del controlador aquí, como register, logout, etc.
  register: async (req, res) => {
    const { email, password, rol } = req.body;

    // Expresión regular para validar el formato de correo electrónico
    // Esta regex es bastante estándar y cubre la mayoría de los formatos válidos.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son obligatorios.",
      });
    }

    // Validación de formato de correo electrónico con regex
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "El formato del correo electrónico es inválido.",
      });
    }

    try {
      // Verificar si el usuario ya existe (usando correo_electronico como en tu DDL)
      const checkUserQuery = "SELECT id_usuario FROM usuarios WHERE email = $1";
      const existingUser = await pool.query(checkUserQuery, [email]);

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "El correo electrónico ya está registrado.",
        });
      }

      // Hashear la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10); // 10 es el saltRounds

      // Insertar el nuevo usuario en la base de datos (usando correo_electronico y contrasena_hash como en tu DDL)
      const insertUserQuery = `
                  INSERT INTO usuarios (email, password_hash, rol)
                  VALUES ($1, $2, $3)
                  RETURNING id_usuario, email, rol;
              `;
      const newUserResult = await pool.query(insertUserQuery, [
        email,
        hashedPassword,
        rol || "admin",
      ]); // Rol por defecto

      const newUser = newUserResult.rows[0];

      // Generar un token para el usuario recién registrado (opcional)
      const token = jwt.sign(
        {
          id: newUser.id_usuario,
          email: newUser.email,
          rol: newUser.rol,
        },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        token: token,
        user: {
          id: newUser.id_usuario,
          email: newUser.email,
          rol: newUser.rol,
        },
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor durante el registro.",
      });
    }
  },
};
