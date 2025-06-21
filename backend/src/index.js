import express from 'express'
import {config} from 'dotenv'
import pg from 'pg'

config()

const app = express()
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: true
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