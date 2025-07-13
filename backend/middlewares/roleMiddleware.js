/**
 * Middleware para verificar el rol del usuario.
 * @param {string} requiredRole - El rol requerido para acceder a la ruta.
 * @returns {function} - Middleware de Express.
 */
export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // El middleware 'protect' ya debería haber decodificado el token
    // y adjuntado la información del usuario en req.user.
    const user = req.user;

    // Verificamos si la información del usuario y su rol existen.
    if (!user || !user.rol) {
      return res.status(403).json({ message: 'Acceso denegado. No se proporcionó información de rol.' });
    }

    // Comparamos el rol del usuario con el rol requerido.
    if (user.rol !== requiredRole) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios para esta acción.' });
    }

    // Si el usuario tiene el rol correcto, continuamos con la siguiente función en la cadena.
    next();
  };
};
