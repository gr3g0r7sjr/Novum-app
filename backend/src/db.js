// backend/src/db.js
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir import.meta.url a un path de directorio absoluto para construir rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar la configuración usando una ruta absoluta construida
// Esto resuelve config.js desde backend/src/config/config.js
import { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT } from './config/config.js';

const { Pool } = pg;

const pool = new Pool({
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

// Prueba de conexión
pool.query('SELECT NOW()')
    .then(() => console.log('✅ Conexión a la base de datos PostgreSQL exitosa y pool listo.'))
    .catch(err => console.error('❌ ERROR! No se pudo establecer la conexión inicial con la base de datos:', err.stack));

export default pool;