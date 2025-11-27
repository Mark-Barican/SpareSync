CREATE INDEX idx_suppliers_name ON suppliers (name);
CREATE INDEX idx_suppliers_email ON suppliers (email);

-- Indexes for performance on reorder_history table
CREATE INDEX idx_reorder_history_part_id ON reorder_history (part_id);
CREATE INDEX idx_reorder_history_supplier_id ON reorder_history (supplier_id);
CREATE INDEX idx_reorder_history_order_date ON reorder_history (order_date DESC);

-- (Optional) Add more indexes to spare_parts if needed, e.g., if you frequently query by name or part_number
-- CREATE INDEX idx_spare_parts_name ON spare_parts (name);
-- CREATE INDEX idx_spare_parts_part_number ON spare_parts (part_number);