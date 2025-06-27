import 'dotenv/config'
import {FRONTEND_URL, DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} from './config/config.js'; 
import express from 'express';
import cors from 'cors';

const app = express()

const port = process.env.PORT || 3000;

import {authRoutes} from './routes/authRoutes';

app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json()); 

app.use('/api', authRoutes)

app.get('/', (req, res) => {
    res.send('Hola, el servidor esta corriendo y funcionando en express. Accede a /api/login para autenticar.')
})

app.listen(port, () => {
    console.log(`Servidor escuchando en http:localhost:${port}`)
})