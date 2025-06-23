import express from 'express'
import {config} from 'dotenv'
import pg from 'pg'
import cors from 'cors'
import {FRONTEND_URL, DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_PORT} from '../config.js'

config()

const app = express()

app.use(cors({
    origin: FRONTEND_URL
}
))
const pool = new pg.Pool({
    host: DB_HOST, 
    database: DB_DATABASE, 
    user:DB_USER, 
    password: DB_PASSWORD, 
    port: DB_PORT
})

app.get('/', (req, res) => {
    res.send('Hola')
})

app.get('/ping', async (req, rest) =>{
    const result = await pool.query('SELECT NOW()')
    return rest.json(result.rows[0])
})

app.listen(3000)
console.log('Server on port', 3000)