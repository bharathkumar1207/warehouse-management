import { postgresPool } from "../../../../../db/db.config.js";
import { getCurrentTime } from "../../../shared/time.js";
import format from "pg-format";

/**
 * creates a usergroup
 * @param tenantName name of the schema 
 * @param usergroupName name of the usergroup
 * @returns usergroup created or not
 */
export async function createUsergroup({ tenantName, usergroupName }:{ tenantName:string, usergroupName:string }):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`set search_path to %I`,tenantName))
        const result = await client.query(`select max(usergroup_id) as max_id from usergroup`)
        const id = (result.rows[0].max_id ?? 0) + 1
        const time = getCurrentTime()

        await client.query(`insert into usergroup values($1,$2,$3)`,[id,usergroupName,time])
        return `usergroup ${usergroupName} created successfully`
    }
    catch(e){
        throw e
    }
    finally{
        client.release()
    }
}

/**
 * updates a usergroup
 * @param tenantName name of the schema 
 * @param usergroupName name of the usergroup
 * @param newName new name of the usergroup
 * @returns usergroup updated or not
 */
export async function updateUsergroup({ tenantName, usergroupName , newName }:{ tenantName:string, usergroupName:string ,newName:string }):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`set search_path to %I`,tenantName))
        await client.query(`update usergroup set usergroup_name = $1 where usergroup_name = $2`,[newName,usergroupName])

        return `usergroup updated successfully`
    }
    catch(e){
        throw e
    }
    finally{
        client.release()
    }
}

/**
 * deletes a usergroup
 * @param tenantName name of the schema 
 * @param usergroupName name of the usergroup
 * @returns usergroup deleted or not
 */
export async function deleteUsergroup({ tenantName, usergroupName }:{tenantName:string, usergroupName:string }):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`set search_path to %I`,tenantName))
        await client.query(`delete from usergroup where usergroup_name = $1`,[usergroupName])

        return `usergroup ${usergroupName} deleted successfully`
    }
    catch(e){
        throw e
    }
    finally{
        client.release()
    }
}