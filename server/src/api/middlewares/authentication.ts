import { Request, Response,  NextFunction} from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET:string = String(process.env.JWT_SECRET)

export function authenticateToken(req: Request, res:Response, next:NextFunction):void{
    const token = req.cookies.token

    if(!token){
        res.status(403).json({ message: 'Access denied. No token provided.'})
        return
    }

    jwt.verify(token, JWT_SECRET, (error:any, decoded:any) =>{
        if(error){
            res.status(401).json({ message: 'Invalid or expired token'})
        }

        const tenantName = decoded?.tenantName
        const userName = decoded?.username
        const adminId = decoded?.adminId
        const  time = decoded.time
        next();
    })
}