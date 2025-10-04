import  express from 'express'
import cors from 'cors'


import loginRoutes from "./api/routes/login.routes.ts"
import signupRoutes from "./api/routes/signup.routes.ts"

export const app = express()
app.use(cors({
    origin: 'http://localhost:5173', // Must match frontend origin exactly
    credentials: true  
}))
app.use(express.json())

//Routes


app.use('/api',loginRoutes)
app.use('/api',signupRoutes)