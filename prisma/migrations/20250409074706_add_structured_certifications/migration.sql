-- Backup old certifications text (optional)
-- ALTER TABLE "createresume" ADD COLUMN old_certifications TEXT;

-- Replace non-JSON values with a valid default (empty array)
UPDATE "createresume"
SET certifications = '[]'
WHERE certifications IS NULL
   OR certifications NOT LIKE '[%';

-- Now safely convert the column type to JSONB
ALTER TABLE "createresume"
ALTER COLUMN certifications TYPE JSONB
USING certifications::jsonb;
