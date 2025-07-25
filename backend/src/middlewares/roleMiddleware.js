const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    // Asume que req.user ya ha sido poblado por authenticateToken
    // con la información del usuario (id, email, rol).
    if (!req.user || !req.user.rol) {
      return res.status(403).json({
        message: "Acceso denegado: No autenticado o rol no definido.",
      });
    }

    if (req.user.rol !== requiredRole) {
      return res.status(403).json({
        message: `Acceso denegado: Se requiere el rol '${requiredRole}'.`,
      });
    }

    next(); // Si el usuario tiene el rol requerido, continúa con la siguiente función middleware/ruta
  };
};

export default authorizeRole;
