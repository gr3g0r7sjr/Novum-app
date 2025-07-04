import { Usuario } from '../models/User.js'; 
import bcrypt from 'bcryptjs';

export const authController = {
    login: async (req, res) => {
        const {email, password} = req.body; 

        if(!email || !password){
            return res.status(400).json({success: false, message: 'Correo y contraseña son obligatorios'})
        }

        try {
            const user = await Usuario.findByEmail(email); 

            if(!user){
                return res.status(401).json({success: false, message: 'Credenciales inválidas.'})
            }

            const passwordMatch = await bcrypt.compare(password, user.password); 

            if(!passwordMatch){
                return res.status(401).json({ success: false, message: 'Credenciales inválidas.' })
            }

            res.status(200).json({
                success: true, 
                message:'Inicio de Sesion exitoso',
                user:{id: user.id, email: user.email}
            })
        } catch (error) {
            console.error('Error en authController.login', error); 
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al intentar iniciar sesión.',
                error: error.message
            })
        }
    }
}