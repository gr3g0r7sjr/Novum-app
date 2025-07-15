// backend/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('DEBUG AUTH: Token recibido:', token ? 'Sí' : 'No'); // <-- DEBUG
    
    if (token == null) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('DEBUG AUTH: Error de verificación de token:', err.message); // <-- DEBUG
            return res.status(403).json({ message: 'Token de autenticación inválido o expirado.' });
        }
        req.user = user;
        console.log('DEBUG AUTH: Token verificado. req.user adjuntado:', req.user); // <-- DEBUG
        next();
    });
};

export default authenticateToken;