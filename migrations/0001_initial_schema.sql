-- Spare Parts Table
CREATE TABLE spare_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER NOT NULL DEFAULT 0,
  supplier_lead_time INTEGER NOT NULL DEFAULT 0, -- in days
  cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster name searches
CREATE INDEX idx_spare_parts_name ON spare_parts(name);
CREATE INDEX idx_spare_parts_urgency ON spare_parts((current_stock - reorder_point));

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE part_suppliers (
  part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  lead_time INTEGER NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (part_id, supplier_id)
);

CREATE TABLE reorder_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID REFERENCES spare_parts(id) ON DELETE CASCADE,
  quantity_ordered INTEGER NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending' -- pending, shipped, delivered
);
