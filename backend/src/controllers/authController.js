//import { Usuario } from '../models/User.js'; 
import pool from '../db.js';
import bcrypt from 'bcryptjs';

export const authController = {
    login: async (req, res) => {
        const email = req.body.email; 
        const password = req.body.password; 

        if(!email || !password){
            return res.status(400).json({success: false, message: 'Correo y contraseña son obligatorios'})
        }

        try {
            const result = await pool.query('SELECT id, email, password FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

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