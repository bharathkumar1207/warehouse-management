import { postgresPool } from "../../../../../db/db.config.js";
import format from 'pg-format'

/**
 * creates a new admin record in the tenant admin
 * @param tenantName name of the schema
 * @param adminName username of the tenant admin
 * @param password password of the tenant admin
 * @returns tenant admin created or not
 */
export async function createTenantAdminUser({tenantName,adminName,password}:{tenantName:string,adminName:string,password:string}):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`set search_path to  %I`,tenantName))
        await client.query(`insert into tenant_admin values($1,$2)`,[adminName,password])
        return "Tenant admin user created successfully"
    }
    catch(e){
        return String(e)
    }
    finally{
        client.release()
    }
}

/**
 * updates admin id or password or both  in tenant admin table
 * @param tenantName name of the schema
 * @param adminName existing username of the tenant admin
 * @param userName new username of the tenant admin that needs to updated (optional)
 * @param password updated password of the tenant admin (optional)
 * @returns updated successfully or not
 */
export async function updateTenantAdmin({ tenantName, adminName, userName, password }: {tenantName:string, adminName:string,userName?:string,password?:string}):Promise<string> {
    const client = await postgresPool.connect()
  try {
    await client.query(format(`set search_path to %I`,tenantName))
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (userName) {
      updates.push(`admin_name = $${paramIndex++}`);
      values.push(userName);
    }

    if (password) {
      updates.push(`password = $${paramIndex++}`);
      values.push(password);
    }

    if (updates.length === 0) {
      return 'No fields to update.';
    }

    values.push(adminName); // admin_id goes at the end
    const query = `UPDATE tenant_admin SET ${updates.join(', ')} WHERE admin_name = $${paramIndex}`;

    await client.query(query, values);

    return 'Tenant admin updated successfully.';
  } catch (e) {
    return String(e)
  }
  finally{
    client.release()
  }
}


/**
 * deletes tenant admin record from the tenant admin table
 * @param tenantName name of the schema
 * @param adminName tenant admin id thats needs to be deleted 
 * @returns deleted or not 
 */
export async function deleteTenantAdmin({tenantName, adminName}:{tenantName:string, adminName:string}):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`set search_path to %I`,tenantName))
        await client.query(`delete from tenant_admin where admin_name = $1`,[adminName])
        return `deleted ${adminName} successfully`
    }
    catch(e){
        return String(e)
    }
    finally{
        client.release()
    }
}