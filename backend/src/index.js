// backend/server.js (tu index.js)
import 'dotenv/config'; // Carga las variables de entorno desde .env
import {FRONTEND_URL, JWT_SECRET } from './config/config.js'; // Importa variables de configuración
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken'; 

// Importa los middlewares
import authenticateToken from './middlewares/authMiddleware.js'; 


import authRoutes from './routes/authRoutes.js'; 
import vacantesRoutes from './routes/vacantesRoutes.js'; 

const app = express();
const port = process.env.PORT || 3000; 

// Configuración de CORS
app.use(cors({
    origin: [FRONTEND_URL, 'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares para parsear el cuerpo de las peticiones
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api', authRoutes); // authRoutes manejará /login, /register, etc.

app.use('/api/vacantes', authenticateToken, vacantesRoutes); // <-- MONTAJE CORREGIDO

// Ruta de bienvenida para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Hola, el servidor esta corriendo y funcionando en express. Accede a /api/login para autenticar.');
});

// Inicia el servidor de Express
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
