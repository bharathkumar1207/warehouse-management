import { postgresPool } from "../../../../../db/db.config.js";
import { QueryResult } from "pg";
import format from 'pg-format'

/**
 * creates a new user in the users table
 * @param username name of user
 * @param address address of the user
 * @param mobile_no mobile number of the user
 * @param group_id group id of the user which he needs to assigned
 * @returns  message:User created successfully if user created or error 
 */
export async function createUser({username, address = '', mobile_no = '', usergroup_id = null}:{username:string, address?:string, mobile_no?:string, usergroup_id?:number | null}):Promise<String>{
    const client = await postgresPool.connect()
    const previousId:QueryResult = await client.query(`select max(user_id) as max_id from users`)
    const maxId = previousId.rows[0].max_id ?? 0; // default to 0 if table is empty
    const userId = Number(maxId) + 1;
    try{
    await client.query(`insert into users values($1,$2,$3,$4,$5)`,[userId,username,address,mobile_no,usergroup_id])
    return 'User created successfully'
    }
    catch (e: any) {
        if (e.code === '23505') {
            const message = 'User already exists'
            return message
        } else {
            const message = 'Database error :' + e.message
            return message
        }
    }
    finally{
        client.release()
    }
}


/**
 * Update user details in usertable
 * @param username username of the user that needs to be updated
 * @param address updated address of the user
 * @param mobile_no updated mobile number of the user
 * @param usergroup_id updated usergroup  id that needs to be assigned to the user
 * @returns 
 */
export async function updateUser({username, address, mobile_no, usergroup_id}:{username: string; address?: string; mobile_no?: string; usergroup_id?: number | null;}): Promise<string> {
    const client = await postgresPool.connect()
    try {
        // Prepare dynamic SET clause
        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let index = 2; // Start from $2 (since $1 will be username for WHERE)

        if (address !== undefined) {
        fieldsToUpdate.push(`address = $${index++}`);
        values.push(address);
        }
        if (mobile_no !== undefined) {
        fieldsToUpdate.push(`mobile_no = $${index++}`);
        values.push(mobile_no);
        }
        if (usergroup_id !== undefined) {
        fieldsToUpdate.push(`usergroup_id = $${index++}`);
        values.push(usergroup_id);
        }
        if (fieldsToUpdate.length === 0) {
        return 'No fields provided to update'
        }
        const updateQuery = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE username = $1`
        // Add username as first value
        values.unshift(username);
        const result = await client.query(updateQuery, values)

        if (result.rowCount === 0) {
        return `No user found with username "${username}"`
        }
        return 'User details updated successfully';
    } catch (e: any) {
        return 'Failed to update user';
    }
    finally{
        client.release()
    }
}

/**
 * deletes a user for a specific tenant
 * @param tenantName name of the schema 
 * @param username name of the user
 * @returns user deleted or not
 */
export async function deleteUser({ tenantName, username }:{tenantName:string, username:string }):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`set search_path to %I`,tenantName))
        await client.query(`delete from users where username = $1`,[username])

        return `User : ${username} deleted successfully`
    }
    catch(e){
        throw e
    }
    finally{
        client.release()
    }
}
