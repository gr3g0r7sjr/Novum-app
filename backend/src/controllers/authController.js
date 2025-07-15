import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import { JWT_SECRET } from '../config/config.js'

export const authController = {
    login: async (req, res) => {
        // Desestructurar email y password del cuerpo de la petición
        const { email, password } = req.body; 

        // 1. Validar que se recibieron email y password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios.' });
        }

        try {
            
            const userQuery = 'SELECT id_usuario, email, password_hash, rol FROM usuarios WHERE email = $1';
            const result = await pool.query(userQuery, [email]);

            const user = result.rows[0];

            // 3. Verificar si el usuario existe
            if (!user) {
                return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
            }

            // 4. Comparar la contraseña proporcionada con el hash almacenado
            // Usa user.password_hash que es el nombre de tu columna en la DB
            const passwordMatch = await bcrypt.compare(password, user.password_hash); 

            if (!passwordMatch) {
                return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
            }

            // 5. Si las credenciales son válidas, crear el JWT
            // El payload del token contendrá la información del usuario que necesitas para futuras solicitudes
            const token = jwt.sign(
                { 
                    id: user.id_usuario, // Usamos id_usuario de la DB
                    email: user.email, // Usamos 'email' como lo tenías en la consulta
                    rol: user.rol // Incluimos el rol del usuario (asumiendo que se selecciona en la query)
                }, 
                JWT_SECRET, // Tu clave secreta para firmar el token
                { expiresIn: '1h' } // El token expira en 1 hora (puedes ajustar esto)
            );

            // 6. Enviar el token y la información básica del usuario en la respuesta
            res.status(200).json({
                success: true, 
                message: 'Inicio de Sesión exitoso',
                token: token, // <-- El JWT se envía aquí
                user: {
                    id: user.id_usuario, // Usamos id_usuario
                    email: user.email, // Usamos 'email'
                    rol: user.rol // Incluimos el rol en la respuesta
                }
            });

        } catch (error) {
            console.error('Error en authController.login:', error); // Mensaje de error más descriptivo
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al intentar iniciar sesión.',
                error: error.message
            });
        }
    }
}