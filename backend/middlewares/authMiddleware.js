import jwt from 'jsonwebtoken';
import pool from '../db/db.js';

/**
 * Middleware para proteger rutas que requieren autenticación.
 * Verifica el token JWT del encabezado de autorización.
 */
export const protect = async (req, res, next) => {
  let token;

  // Verifica si el encabezado de autorización existe y empieza con "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extrae el token del encabezado (formato: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifica y decodifica el token usando el secreto
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Busca al usuario en la base de datos usando el ID del token
      // Se selecciona todo excepto la contraseña por seguridad.
      const query = 'SELECT id_usuario, correo_electronico, rol FROM public.usuarios WHERE id_usuario = $1';
      const { rows } = await pool.query(query, [decoded.id]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'No autorizado, usuario no encontrado.' });
      }

      // 4. Adjunta la información del usuario al objeto 'req' para usarlo en rutas posteriores
      req.user = rows[0];
      req.user.id = rows[0].id_usuario; // Aseguramos que req.user.id esté disponible

      next(); // Continúa con el siguiente middleware o controlador

    } catch (error) {
      console.error('Error de autenticación:', error.message);
      return res.status(401).json({ message: 'No autorizado, el token falló.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se proporcionó un token.' });
  }
};
