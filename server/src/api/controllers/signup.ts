import { postgresPool } from "../../../../db/db.config.ts"
import { Request, Response} from "express"
import format from "pg-format"
import { createAdminUser } from "../../infrastructure/db/admin-schema-functions/admin-table.ts"
import { passwordHashing, passwordValidator } from "../../shared/password.ts"
import { createTenantAdminUser } from "../../infrastructure/db/tenant-schema-functions/tenant-admin-table .ts"

/**
 * admin sign up
 * @param req API request from express
 * @param res API response from express
 * @returns nothing
 */
export async function adminSignup(req: Request, res: Response): Promise<void> {
    const client = await postgresPool.connect();
    const data = req.body;

    if ((!data.adminId || !data.password) && data.message === 'admin-signup') {
        res.status(400).json({ message: 'Username and password are required' });
        client.release();
        return;
    }

    try {
        const isValidPassword = await passwordValidator({ password: data.password });

        if (!isValidPassword) {
            res.status(401).json({ message: 'Enter a strong password' });
            return;
        }

        const hashedPassword = await passwordHashing({ password: data.password });

        await createAdminUser({adminName: data.adminId, password: hashedPassword});

        res.status(200).json({ message: 'Admin User Created successfully' });

    } catch (e) {
        console.error('Signup error:', e);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
}

/**
 * Tenant Signup
 * @param req API request from express
 * @param res API response from express
 * @returns nothing
 */
export async function tenantAdminSignUp( req:Request, res:Response ):Promise<void>{
    const client = await postgresPool.connect()
    const data = req.body

    if((!data.tenantName || !data.username || !data.password) && data.message !== 'tenant-signup' ){
        res.status(400).json({ message : 'Username and password and tenant Name are required'})
        return
    }

    try{
        await client.query(format(`set search_path to %I`,data.tenantName))
        
         const isValidPassword = await passwordValidator({ password: data.password });

        if (!isValidPassword) {
            res.status(401).json({ message: 'Enter a strong password' });
            return;
        }

        const hashedPassword = await passwordHashing({ password: data.password });

        await createTenantAdminUser({tenantName:data.tenantName, adminName:data.username, password:hashedPassword})
        res.status(200).json({ message: 'Tenant admin User Created successfully' });
    }
    catch (e) {
        console.error('Signup error:', e)
        res.status(500).json({ message: 'Internal server error' })
    } finally {
        client.release()
    }
}