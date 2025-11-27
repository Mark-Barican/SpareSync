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
