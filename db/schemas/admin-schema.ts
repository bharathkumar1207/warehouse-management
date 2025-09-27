import { postgresPool ,client } from "../db.config.js";

/**
 * creates admin table in database
 * @returns table created or not
 */
export async function createAdminTable():Promise<string>{
    try{
        await client.query(`create table admin(
                            admin_name varchar(30) primary key,
                            admin_password text)`)
        return "Admin table created successfully"
    }
    catch(e){
        return String(e)
    }
    
}

/**
 * creates tenant table in database
 * @returns table created or not
 */
export async function createTenantTable():Promise<string>{
    try{
        await client.query(`create table tenant(
                            tenant_id int primary key,
                            tenant_name varchar(30) unique,
                            license_id int unique,
                            license_expiry TEXT)`)
        return "Tenant table created successfully"
    }
    catch(e){
        return String(e)
    }
    
}

export async function createAdminSchema():Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(`BEGIN`)

        await createAdminTable()
        await createTenantTable()

        await client.query(`COMMIT`)
        return `admin schema created successfully`
    }
    catch(e){
        await client.query(`ROLLBACK`)
        return String(e)
    }
    finally{
        client.release()
    }
}