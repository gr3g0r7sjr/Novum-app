import pool from '../db.js';
import bcrypt from 'bcryptjs';

export const Usuario = {
    findByEmail: async (email) => {
        try {
            const result = await pool.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]
            ); 
            return result.rows[0]
        } catch (error) {
            console.error('Error en Usuario.findbyEmail', error)
            throw error
        }
    }, 

    create: async ({email, password}) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); 
            const result = await pool.query('INSERT INTO users (email,password) VALUES ($1, $2) RETURNING id, email', [email, password])
        } catch (error) {
            console.error('Error en Usuario.create', error)
            throw error; 
        }
    }
}

