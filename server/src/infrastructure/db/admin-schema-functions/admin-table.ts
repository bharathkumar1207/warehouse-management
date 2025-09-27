import { postgresPool } from "../../../../../db/db.config.js";

/**
 * creates a new admin record in the admin
 * @param adminName username of the admin
 * @param password password of the admin
 * @returns admin created or not
 */
export async function createAdminUser({adminName,password}:{adminName:string,password:string}):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(`insert into admin values($1,$2)`,[adminName,password])
        return "Admin user created successfully"
    }
    catch(e){
        return String(e)
    }
    finally{
        client.release()
    }
}

/**
 * updates admin id or password or both 
 * @param adminName existing username of the admin
 * @param userName new username of the admin that needs to updated (optional)
 * @param password updated password of the admin (optional)
 * @returns updated successfully or not
 */
export async function updateAdmin({ adminName, userName, password }: {adminName:string,userName?:string,password?:string}):Promise<string> {
    const client = await postgresPool.connect()
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (userName) {
      updates.push(`admin_name = $${paramIndex++}`);
      values.push(userName);
    }

    if (password) {
      updates.push(`admin_password = $${paramIndex++}`);
      values.push(password);
    }

    if (updates.length === 0) {
      return 'No fields to update.';
    }

    values.push(adminName); // admin_id goes at the end
    const query = `UPDATE admin SET ${updates.join(', ')} WHERE admin_name = $${paramIndex}`;

    await client.query(query, values);

    return 'Admin updated successfully.';
  } catch (e) {
    return String(e)
  }
  finally{
    client.release()
  }
}


/**
 * deletes admin record from the "admin" table
 * @param adminName admin id thats needs to be deleted 
 * @returns deleted or not 
 */
export async function deleteAdmin({adminName}:{adminName:string}):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(`delete from admin where admin_name = $1`,[adminName])
        return `deleted ${adminName} successfully`
    }
    catch(e){
        return String(e)
    }
    finally{
        client.release()
    }
}