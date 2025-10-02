import { postgresPool } from "../../../../../db/db.config.js";
import { createTenantSchema } from "../../../../../db/schemas/tenant-schema.js";
import format from 'pg-format'

/**
 * creates new tenant in tenant table
 * @param tenantName name of tenant (optional)
 * @param licenseId license id for the tenant (optional)
 * @param licenseExpiry expiry date of the license (optional)
 * @returns tenant created successfully or not
 */
export async function createTenant({
  tenantName,
  licenseId,
  licenseExpiry,
}: {
  tenantName: string;
  licenseId?:number;
  licenseExpiry?: string;
}): Promise<string> {
    const client = await postgresPool.connect()
  try {
        await client.query(`BEGIN`)
        // Get current max tenant_id
        const result = await client.query(`SELECT MAX(tenant_id) as max_id FROM tenant`);
        const newTenantId = (result.rows[0].max_id ?? 0) + 1;

        const columns = ['tenant_id', 'tenant_name'];
        const values: any[] = [newTenantId, tenantName];
        const placeholders = ['$1', '$2'];

        let paramIndex = 3;

        if (licenseId !== undefined) {
        columns.push('license_id');
        values.push(licenseId);
        placeholders.push(`$${paramIndex++}`);
        }
        if (licenseExpiry !== undefined) {
        columns.push('license_expiry');
        values.push(licenseExpiry);
        placeholders.push(`$${paramIndex++}`);
        }

        const query = `
        INSERT INTO tenant (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        `;

        await client.query(query, values)
        await createTenantSchema({tenantName:tenantName,client:client})
        await client.query(`COMMIT`)
           
        
        return `Tenant '${tenantName}' created successfully with ID ${newTenantId}`;
 
    } 
    catch (e) {
        await client.query(`ROLLBACK`)
        return String(e);
    }
    finally{
        client.release()
    }
}


/**
 * Updates tenant record and renames schema if needed.
 * @param tenantName Current name of the tenant
 * @param newName New name of the tenant (optional)
 * @param licenseId Updated license count (optional)
 * @param licenseExpiry Updated license expiry (optional)
 * @returns Result message
 */
export async function updateTenant({
  tenantName,
  newName,
  licenseId,
  licenseExpiry
}: {
  tenantName: string,
  newName?: string,
  licenseId?: number,
  licenseExpiry?: string
}): Promise<string> {

  const client = await postgresPool.connect();

  try {
    await client.query('BEGIN');

    // 1. Rename schema if needed (use pg-format to safely interpolate schema names)
    if (newName !== undefined && newName !== tenantName) {
      await client.query(format(`ALTER SCHEMA %I RENAME TO %I`, tenantName, newName));
    }

    // 2. Build the UPDATE query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (newName !== undefined) {
      updates.push(`tenant_name = $${paramIndex++}`);
      values.push(newName);
    }
    if (licenseId !== undefined) {
      updates.push(`license_id = $${paramIndex++}`);
      values.push(licenseId);
    }
    if (licenseExpiry !== undefined) {
      updates.push(`license_expiry = $${paramIndex++}`);
      values.push(licenseExpiry);
    }

    if (updates.length > 0) {
      // Always use old tenantName in WHERE clause to find the record
      values.push(tenantName);
      const query = `UPDATE tenant SET ${updates.join(', ')} WHERE tenant_name = $${paramIndex}`;
      await client.query(query, values);
    }

    await client.query('COMMIT');
    return `Tenant '${tenantName}' updated successfully`;
  } catch (e) {
    await client.query('ROLLBACK');
    return `Failed to update tenant: ${String(e)}`;
  } finally {
    client.release();
  }
}


/**
 * Deletes tenant record and its associated schema
 * @param tenantName Name of the tenant to be deleted
 * @returns Success or error message
 */
export async function deleteTenant({ tenantName }: { tenantName: string }): Promise<string> {
  const client = await postgresPool.connect();
  try {
    await client.query(`BEGIN`);

    await client.query(format(`DROP SCHEMA %I CASCADE`, tenantName));

    await client.query(`DELETE FROM tenant WHERE tenant_name = $1`, [tenantName]);

    await client.query(`COMMIT`);
    return `Tenant '${tenantName}' removed successfully`;
  } catch (e) {
    await client.query(`ROLLBACK`);
    return `Failed to delete tenant '${tenantName}': ${String(e)}`;
  } finally {
    client.release();
  }
}