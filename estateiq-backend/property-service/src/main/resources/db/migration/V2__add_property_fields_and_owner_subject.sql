ALTER TABLE properties ADD COLUMN owner_subject VARCHAR(255);
ALTER TABLE properties ADD COLUMN year_built INT;
ALTER TABLE properties ADD COLUMN floor INT;
ALTER TABLE properties ADD COLUMN parking BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN furnished BOOLEAN DEFAULT FALSE;
ALTER TABLE properties ADD COLUMN latitude DECIMAL(10, 7);
ALTER TABLE properties ADD COLUMN longitude DECIMAL(10, 7);

CREATE INDEX idx_properties_owner_subject ON properties(owner_subject);
CREATE INDEX idx_properties_locality ON properties(locality);
