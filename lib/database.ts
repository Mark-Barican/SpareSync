import { neon } from '@neondatabase/serverless';

// IMPORTANT: Ensure the DATABASE_URL environment variable is set in your Vercel project.
// See: https://vercel.com/docs/projects/environment-variables

function getSql() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set. Configure it in your Vercel project settings.');
    }

    return neon(process.env.DATABASE_URL);
}

// Shape of a part as used by the database helpers (camelCase fields mapped to snake_case columns)
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
    const trimmedName = part.name.trim();
    const result = await sql`
        INSERT INTO spare_parts (name, current_stock, reorder_point, supplier_lead_time, cost)
        VALUES (${trimmedName}, ${part.currentStock}, ${part.reorderPoint}, ${part.supplierLeadTime}, ${part.cost})
        RETURNING *
    `;

    return result;
}

// PATCH / partial update
export async function updatePart(id: string, part: Partial<parts>) {
    const sql = getSql();

    // Build dynamic SET clause only for provided fields
    const fields: string[] = [];
    const values: any[] = [];

    if (part.name !== undefined) {
        fields.push(`name = ${values.push(part.name.trim()) && values[values.length - 1]}`);
    }
    if (part.currentStock !== undefined) {
        fields.push(`current_stock = ${values.push(part.currentStock) && values[values.length - 1]}`);
    }
    if (part.reorderPoint !== undefined) {
        fields.push(`reorder_point = ${values.push(part.reorderPoint) && values[values.length - 1]}`);
    }
    if (part.supplierLeadTime !== undefined) {
        fields.push(`supplier_lead_time = ${values.push(part.supplierLeadTime) && values[values.length - 1]}`);
    }
    if (part.cost !== undefined) {
        fields.push(`cost = ${values.push(part.cost) && values[values.length - 1]}`);
    }

    // If nothing to update, just return
    if (fields.length === 0) {
        return;
    }

    await sql`
        UPDATE spare_parts
        SET ${sql([fields.join(', ')])}
        WHERE id = ${id}
    `;
}

export async function getPartById(id: string) {
    const sql = getSql();
    const result = await sql`
        SELECT * FROM spare_parts
        WHERE id = ${id}
    `;
    return result.length > 0 ? result[0] : null;
}

export async function searchParts(searchTerm: string) {
    const sql = getSql();
    const result = await sql`
        SELECT * FROM spare_parts
        WHERE name ILIKE ${'%' + searchTerm + '%'}
        ORDER BY created_at DESC
    `;
    return result;
}

export async function getPartStatistics() {
    const sql = getSql();

    const [counts] = await sql`
        SELECT
            COUNT(*)::int AS total_parts,
            COUNT(*) FILTER (WHERE current_stock < reorder_point)::int AS parts_needing_reorder,
            COUNT(*) FILTER (WHERE current_stock >= reorder_point)::int AS parts_with_adequate_stock,
            COALESCE(SUM(cost * current_stock), 0)::numeric AS total_inventory_value,
            COALESCE(AVG(supplier_lead_time), 0)::numeric AS average_lead_time
        FROM spare_parts
    `;

    return {
        totalParts: counts.total_parts,
        partsNeedingReorder: counts.parts_needing_reorder,
        partsWithAdequateStock: counts.parts_with_adequate_stock,
        totalInventoryValue: parseFloat(counts.total_inventory_value),
        averageLeadTime: parseFloat(counts.average_lead_time),
    };
}

// DELETE
export async function deletePart(id: string) {
    const sql = getSql();
    await sql`
        DELETE FROM spare_parts
        WHERE id = ${id}
    `;
}

