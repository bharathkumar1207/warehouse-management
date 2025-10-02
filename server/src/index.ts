import  express from 'express'
import cors from 'cors'


import loginRoutes from "./api/routes/login.routes.ts"


export const app = express()
app.use(cors())
app.use(express.json())

//Routes


app.use('/api',loginRoutes)