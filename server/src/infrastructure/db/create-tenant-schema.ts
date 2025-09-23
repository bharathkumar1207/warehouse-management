import { createUserGroupTable,createCustomerTable,createIncomingStockItems,createIncomingStockTable } from "../../../../db/schemas/tenant-tables.js"
import {createOutgoingStockItems,createOutgoingStockTable,createProductTable,createUserTable,createVendorTable } from "../../../../db/schemas/tenant-tables.js"


export async function createTenantSchema(){
    await createUserGroupTable()
    await createUserTable()
    await createProductTable()
    await createCustomerTable()
    await createVendorTable()
    await createOutgoingStockTable()
    await createOutgoingStockItems()
    await createIncomingStockTable()
    await createIncomingStockItems()
}


// createTenantSchema()