// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js"; // Importa la clave secreta desde tu config

console.log(
  "DEBUG AUTH MIDDLEWARE: JWT_SECRET en middleware (longitud):",
  JWT_SECRET?.length,
); // <-- DEBUG

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("DEBUG AUTH: Token recibido:", token ? "Sí" : "No");
  if (!token) {
    console.log(
      "DEBUG AUTH: No se encontró token en el encabezado Authorization.",
    );
    return res
      .status(401)
      .json({
        message: "Acceso denegado. No se proporcionó token de autenticación.",
      });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("DEBUG AUTH: Error de verificación de token:", err.message);
      // Si el error es 'jwt expired', puedes dar un mensaje más específico
      if (err.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({
            message:
              "Token de autenticación expirado. Por favor, inicia sesión de nuevo.",
          });
      }
      return res
        .status(403)
        .json({ message: "Token de autenticación inválido." });
    }
    req.user = user; // ¡Aquí se adjunta el payload decodificado al objeto req!
    console.log("DEBUG AUTH: Token verificado. req.user adjuntado:", req.user); // <-- DEBUG
    console.log(
      "DEBUG AUTH: ID de usuario desde token (req.user.id):",
      req.user.id,
    ); // <-- DEBUG
    next(); // Pasa el control al siguiente middleware o controlador
  });
};

export default authenticateToken;
