import {config} from 'dotenv'
import pg from 'pg'
import {DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} from './config/config.js'
const {Pool} = pg
config()

const pool = new Pool({
    host: DB_HOST, 
    database: DB_DATABASE, 
    user:DB_USER, 
    password: DB_PASSWORD, 
    port: DB_PORT
})


async function testDbConnection() {
    let client; // Declara el cliente fuera del try para que esté accesible en finally
    try {
        client = await pool.connect(); // Adquiere un cliente del pool
        console.log('¡Conectado a PostgreSQL exitosamente y pool listo!');
        // Opcional: Puedes ejecutar una consulta de prueba aquí si lo deseas, por ejemplo:
        // const res = await client.query('SELECT NOW()');
        // console.log('Tiempo actual del servidor DB:', res.rows[0].now);
    } catch (err) {
        console.error('¡ERROR! No se pudo establecer la conexión inicial con la base de datos:', err.stack);
        // Dependiendo de tu aplicación, podrías querer salir del proceso aquí
        // process.exit(1);
    } finally {
        if (client) {
            client.release(); // IMPORTANTE: Libera el cliente de vuelta al pool
            console.log('Cliente liberado al pool.');
        }
    }
}

testDbConnection()


export default pool; 