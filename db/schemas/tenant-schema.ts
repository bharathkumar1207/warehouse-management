import { postgresPool } from "../db.config.js";
import format from "pg-format"
/**
 * usergroup table creation
 * creates usergroup table in database
 * @returns nothing
 */
export async function createUserGroupTable({client}:{client:any}):Promise<void>{
    await client.query(`create table usergroup(
                        usergroup_id int primary key ,
                        usergroup_name varchar(30) unique,
                        created_on TEXT)`)
}

/**
 * user table creation
 * creates users table in database
 * @returns nothing
 */
export async function createUserTable({client}:{client:any}):Promise<void>{
    await client.query(`create table users( 
                        user_id int primary key, 
                        username varchar(30) unique,
                        address TEXT,
                        mobile_no varchar(15),
                        usergroup_id int null,
                        foreign key(usergroup_id) references usergroup(usergroup_id) on delete  set null)`)
}

/**
 * product table creation
 * creates product table in database
 * @returns nothing
 */
export async function createProductTable({client}:{client:any}):Promise<void>{
    await client.query(`create table product(
                        product_id int primary key,
                        product_name varchar(30) unique,
                        price int)`)
}


/**
 * vendor table creation
 * creates vendor table in database
 * @returns nothing
 */
export async function createVendorTable({client}:{client:any}):Promise<void>{
    await client.query(`create table vendor( 
                        vendor_id int primary key, 
                        vendor_name varchar(30) unique,
                        mobile_no varchar(15),
                        address TEXT,
                        POC varchar(30))`)
}


/**
 * customer table creation
 * creates customer table in database
 * @returns nothing
 */
export async function createCustomerTable({client}:{client:any}):Promise<void>{
    await client.query(`create table customer(
                        customer_id int primary key, 
                        customer_name varchar(30) unique,
                        mobile_no varchar(15),
                        address TEXT,
                        POC varchar(30))`)
}

/**
 * Incoming stock table creation
 * creates incoming_stock table in database
 * @returns nothing
 */
export async function createIncomingStockTable({client}:{client:any}):Promise<void>{
    await client.query(`create table incoming_stock(
                        stock_id int primary key,
                        vendor_id int null, foreign key(vendor_id) references vendor(vendor_id) on delete set null,
                        created_at Text,
                        total_amount int,
                        payment_status boolean,
                        delivery_status boolean)`)
}


/**
 * Incoming stock items table creation
 * creates incoming_stock_items in database
 * @returns nothing
 */
export async function createIncomingStockItems({client}:{client:any}):Promise<void>{
    await client.query(`create table incoming_stock_items( 
                        stock_id int primary key,
                        product_id int null, foreign key(product_id) references product(product_id) on delete set null,
                        quantity int,
                        unit_price int,
                        net_price int)`)
}

/**
 * Outgoing stock table creation
 * creates outgoing_stock table in database
 * @returns nothing
 */
export async function createOutgoingStockTable({client}:{client:any}):Promise<void>{
    await client.query(`create table outgoing_stock(
                        stock_id int primary key,
                        customer_id int null, foreign key(customer_id) references customer(customer_id) on delete set null,
                        total_amount int,
                        created_at Text,
                        payment_status boolean,
                        delivery_status boolean)`)
}


/**
 * Outgoing stock items table creation
 * creates Outgoing_stock_items in database
 * @returns nothing
 */
export async function createOutgoingStockItems({client}:{client:any}):Promise<void>{
    await client.query(`create table outgoing_stock_items(
                        stock_id int primary key,
                        product_id int null, foreign key(product_id) references product(product_id) on delete set null,
                        quantity int,
                        unit_price int,
                        net_price int)`)
}

/**
 * creates tenant schema in database
 * @param tenantName name of the tenant
 * @returns created schema or not
 */
export async function createTenantSchema({tenantName ,client }:{tenantName:string, client:any}):Promise<string>{
    try{
        await client.query(format(`create schema %I`,tenantName))
        await client.query(format(`SET search_path to %I`,tenantName))

        
        await createUserGroupTable({client:client})
        await createUserTable({client:client})
        await createProductTable({client:client})
        await createCustomerTable({client:client})
        await createVendorTable({client:client})
        await createOutgoingStockTable({client:client})
        await createOutgoingStockItems({client:client})
        await createIncomingStockTable({client:client})
        await createIncomingStockItems({client:client})

        return `schema ${tenantName} created successfully`
    }
    catch(e){
        return String(e)
    }
}

/**
 * deletes tenant schema in database
 * @param tenantName name of the schema thats needs to be deleted
 * @returns schema deleted or not
 */
export async function deleteTenantSchema({tenantName}:{tenantName:string}):Promise<string>{
    const client = await postgresPool.connect()
    try{
        await client.query(format(`drop schema %I cascade`,tenantName))
        return `deleted schema ${tenantName} successfully `
    }
    catch(e){
        return String(e)
    }
    finally{
        client.release()
    }
}