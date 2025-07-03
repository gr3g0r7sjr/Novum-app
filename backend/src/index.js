// backend/src/index.js
import 'dotenv/config'; // Esto carga las variables de entorno de .env
import express from 'express';
import cors from 'cors';
import path from 'path'; // Necesario para construir rutas absolutas
import { fileURLToPath } from 'url'; // Necesario para obtener __dirname en ES Modules

// Convertir import.meta.url a un path de directorio absoluto para construir rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // __dirname aquí será /workspaces/Novum-app/backend/src

// Importar la configuración usando una ruta absoluta construida
// Importamos config.js que está en la subcarpeta 'config'
import { FRONTEND_URL, DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT } from './config/config.js';

// Importamos el pool de conexiones de la base de datos (está en el mismo nivel)
import pool from './db.js';

// Importamos los routers para las rutas de la API (están en la subcarpeta 'routes')
import authRoutes from './routes/authRoutes.js';
import vacantesRoutes from './routes/vacantesRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
    origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Habilita el parsing de JSON para el cuerpo de las solicitudes

// Rutas de la API
app.use('/api', authRoutes); // Monta las rutas de autenticación
app.use('/api/vacantes', vacantesRoutes); // Monta las rutas de vacantes

// Rutas de prueba
app.get('/', (req, res) => {
    res.send('Hola, el servidor esta corriendo y funcionando en express. Accede a /api/vacantes para la API de vacantes.');
});

// Ruta para probar la conexión con la base de datos
app.get('/ping', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error en el ping a la base de datos:', error.message);
        res.status(500).json({ message: 'Error al conectar a la base de datos.', error: error.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});