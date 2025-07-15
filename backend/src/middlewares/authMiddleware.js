// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js'; // Importa la clave secreta desde tu config

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Error de verificación de token:', err);
            // Si el token es inválido o expirado, devuelve 403
            return res.status(403).json({ message: 'Token de autenticación inválido o expirado.' });
        }
        // Adjunta la información del usuario (payload del JWT) al objeto de solicitud
        req.user = user;
        next(); // Pasa el control al siguiente middleware o a la ruta
    });
};

export default authenticateToken;