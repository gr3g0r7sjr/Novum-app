import {config} from 'dotenv'
import pg from 'pg'
import {DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} from './config/config.js'
const {Pool, Client} = pg
config()

const pool = new Pool({
    host: DB_HOST, 
    database: DB_DATABASE, 
    user:DB_USER, 
    password: DB_PASSWORD, 
    port: DB_PORT
})

const client = new Client({
    host: DB_HOST, 
    database: DB_DATABASE, 
    user:DB_USER, 
    password: DB_PASSWORD, 
    port: DB_PORT
})

await client.connect()

pool.connect((err, client, done) => {
    if(err){
        console.error('Error al conectar a la base de datos', err.stack);
        return;
    }
    console.log('Conectado a PostreSQL exitosamente')
    done()
})

await client.end()

export default pool; 