import 'dotenv/config'
import {FRONTEND_URL, DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} from './config/config.js'; 
import express from 'express';
import cors from 'cors';

const app = express()

const port = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes.js';

app.use(cors({
    origin: [FRONTEND_URL,
    'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use('/api', authRoutes)

app.get('/', (req, res) => {
    res.send('Hola, el servidor esta corriendo y funcionando en express. Accede a /api/login para autenticar.')
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http:localhost:${port}`)
})