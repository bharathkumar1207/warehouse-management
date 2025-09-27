import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const hostName:string = process.env.DB_HOST ? process.env.DB_HOST : 'localhost'
const userName:string = process.env.DB_USER ? process.env.DB_USER : 'postgres'
const password:string = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : ''
const port:number = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
const db:string = process.env.DATABASE ? process.env.DATABASE : 'postgres'

const dbConfig =({
    host:hostName,
    user:userName,
    password:password,
    port:port,
    database:db
})

export const postgresPool = new Pool(dbConfig)
export const client = await postgresPool.connect() 