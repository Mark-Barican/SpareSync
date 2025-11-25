import { neon } from '@neondatabase/serverless';
import { SparePart } from '@/app/types'

// IMPORTANT: Ensure the DATABASE_URL environment variable is set in your Vercel project.
// See: https://vercel.com/docs/projects/environment-variables

function getSql() {
    const sql = neon(process.env.DATABASE_URL!);
    return sql;
}

export type parts = {
    name: string;
    currentStock: number;
    reorderPoint: number;
    supplierLeadTime: number;
    cost: number;
};

export async function getParts() {
    const sql = getSql();
    const result = await sql`SELECT * FROM spare_parts ORDER BY created_at DESC`;
    return result;
}

export async function createPart(part: parts) {
    const sql = getSql();
    const result = await sql`
    INSERT INTO spare_parts (name, current_stock, reorder_point, supplier_lead_time, cost)
    VALUES (${part.name}, ${part.currentStock}, ${part.reorderPoint}, ${part.supplierLeadTime}, ${part.cost})
    RETURNING *`;

    return result;
}

// PATCH
export async function updatePart(id: string, part: parts) {
    const sql = getSql();
    await sql`
    UPDATE spare_parts
    SET name = ${part.name}, currentStock = ${part.currentStock}, reorderPoint = ${part.reorderPoint}, supplierLeadTime = ${part.supplierLeadTime}, cost = ${part.cost}
    WHERE id = ${id}
    `;
}

// DELETE
export async function deletePart(id: string) {
    const sql = getSql();
    await sql`
    DELETE FROM spare_parts
    WHERE id = ${id}
    `;
}


