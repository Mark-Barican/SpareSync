CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: relationship table between parts and suppliers
CREATE TABLE part_suppliers (
    part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    lead_time INTEGER NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (part_id, supplier_id)
);

-- Create the reorder_history table
CREATE TABLE reorder_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE CASCADE, -- Link to your existing spare_parts table
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL, -- Link to the new suppliers table
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL CHECK (unit_cost >= 0),
    total_cost DECIMAL(10, 2) NOT NULL CHECK (total_cost >= 0),
    status VARCHAR(50) DEFAULT 'ordered', -- e.g., 'ordered', 'received', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OPTIONAL: If a spare part can have a primary supplier, add a foreign key to spare_parts
-- You might want to consider if this belongs in the initial schema or a separate migration
-- ALTER TABLE spare_parts
-- ADD COLUMN supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;