import 'dotenv/config.js'
import pg from 'pg'
import {DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} from './config/config.js'
const {Pool} = pg

const sslConfig = DB_HOST === 'localhost' ? false : {
    rejectUnauthorized: false
}

const pool = new Pool({
    host: DB_HOST, 
    database: DB_DATABASE, 
    user:DB_USER, 
    password: DB_PASSWORD, 
    port: DB_PORT,
    ssl: sslConfig
})


async function testDbConnection() {
    let client; 
    try {
        client = await pool.connect(); // Adquiere un cliente del pool
        console.log('¡Conectado a PostgreSQL exitosamente y pool listo!');
    } catch (err) {
        console.error('¡ERROR! No se pudo establecer la conexión inicial con la base de datos:', err.stack);

    } finally {
        if (client) {
            client.release(); // IMPORTANTE: Libera el cliente de vuelta al pool
            console.log('Cliente liberado al pool.');
        }
    }
}

testDbConnection()


export default pool; 