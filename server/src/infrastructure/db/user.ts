import { client } from "../../../../db/db.config.js";
import { QueryResult } from "pg";


/**
 * creates a new user in the users table
 * @param userName name of user
 * @param address address of the user
 * @param mobile_no mobile number of the user
 * @param group_id group id of the user which he needs to assigned
 * @returns  message:User created successfully if user created or error 
 */
export async function createUser({userName, address = '', mobile_no = '', usergroup_id = null}:{userName:string, address?:string, mobile_no?:string, usergroup_id?:number | null}):Promise<String>{
    const previousId:QueryResult =await (await client).query(`select max(user_id) as max_id from users`)
    const maxId = previousId.rows[0].max_id ?? 0; // default to 0 if table is empty
    const userId = Number(maxId) + 1;
    try{
    await (await client).query(`insert into users values($1,$2,$3,$4,$5)`,[userId,userName,address,mobile_no,usergroup_id])
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
}


/**
 * Update user details in usertable
 * @param userName username of the user that needs to be updated
 * @param address updated address of the user
 * @param mobile_no updated mobile number of the user
 * @param usergroup_id updated usergroup  id that needs to be assigned to the user
 * @returns 
 */
export async function updateUser({userName, address, mobile_no, usergroup_id}:{userName: string; address?: string; mobile_no?: string; usergroup_id?: number | null;}): Promise<string> {
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
        values.unshift(userName);
        const result = await (await client).query(updateQuery, values)

        if (result.rowCount === 0) {
        return `No user found with username "${userName}"`
        }
        return 'User details updated successfully';
    } catch (e: any) {
        return 'Failed to update user';
    }
}

