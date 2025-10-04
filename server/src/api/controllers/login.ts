import { postgresPool } from "../../../../db/db.config.ts"
import { Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import format from "pg-format"
import { getCurrentTime } from "../../shared/time.ts"

const JWT_SECRET:string = String(process.env.JWT_SECRET)

/**
 * validate admin login
 * @param req API request from express
 * @param res API response from express
 * @returns nothing
 */
export async function adminLogin( req:Request, res:Response ):Promise<void>{
    const client = await postgresPool.connect()
    const data = req.body
    // console.log(data)
    if(!data.adminId || !data.password ){
        res.status(400).json({ message : 'Username and password  are required'})
        return
    }

    try{
        const result = await client.query(`Select * from admin where admin_name = $1`,[data.adminId])
        if(result.rows.length ===  0){
            res.status(404).json({ message : 'User not found'})
            return
        }

        const storedPassword:string = result.rows[0].admin_password
        const adminId :string = result.rows[0].admin_name
        const isPasswordValid = await bcrypt.compare(data.password, storedPassword)

        if(!isPasswordValid){
            res.status(401).json({ message: 'Incorrect Password' })
            return
        }

        const tokenPayload =  {
            adminId,
            time:getCurrentTime()
        }
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h'})

        res.status(200).json({
            message:'Login successful',
            token
        })
    }
    catch(e){
        console.log('Login error : ',e)
        res.status(500).json({message: 'Internal servr error'})
    }
    finally{
        client.release()
    }
}

/**
 * validate tenant login
 * @param req API request from express
 * @param res API response from express
 * @returns nothing
 */
export async function tenantLogin( req:Request, res:Response ):Promise<void>{
    const client = await postgresPool.connect()
    const data = req.body
    // console.log(data)

    if(!data.tenantName || !data.username || !data.password ){
        res.status(400).json({ message : 'Username and password and tenant Name are required'})
        return
    }

    try{
        await client.query(format(`set search_path to %I`,data.tenantName))
        const result = await client.query(`Select * from tenant_admin where admin_name = $1`,[data.username])
        if(result.rows.length ===  0){
            res.status(404).json({ message : 'User not found'})
            return
        }

        const storedPassword:string = result.rows[0].password
        const username :string = result.rows[0].admin_name
        const isPasswordValid = await bcrypt.compare(data.password, storedPassword)

        if(!isPasswordValid){
            res.status(401).json({ message: 'Incorrect Password' })
            return
        }

        const tokenPayload =  {
            username,
            tenantName:data.tenantName,
            time:getCurrentTime()
        }
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h'})

        res.status(200).json({
            message:'Login successful',
            token
        })
    }
    catch(e){
        console.log('Login error : ', e)
        res.status(500).json({message: 'Internal server error'})
    }
    finally{
        client.release()
    }
}