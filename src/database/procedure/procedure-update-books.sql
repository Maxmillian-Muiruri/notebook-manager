
CREATE OR REPLACE FUNCTION update_books(
    P_title VARCHAR,
    P_author VARCHAR,
    P_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    P_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP 

) RETURNS TABLE (
    id SERIAL,
    title VARCHAR,
    author VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
current _titile VARCHAR;
BEGIN
--CHECK IF THE NOTES EXISTS
SELECT title INTO current_title FROM notes WHERE id = P_id;
IF NOT FOUND THEN
    RAISE EXCEPTION 'Note with id % not found', P_id;
END IF;
--if title is not null and different from current , check for duplicate
IF P_title IS NOT NULL AND P_title <> current_title THEN
    IF EXISTS (SELECT 1 FROM notes WHERE title = P_title) THEN
        RAISE EXCEPTION 'A note with the title "%" already exists', P_title;
    END IF;
END IF;
--UPDATE THE NOTE
UPDATE notes
SET 
    title = COALESCE(P_title, current_title),
    author = COALESCE(P_author, author),
    created_at = COALESCE(P_created_at, created_at),
    updated_at = COALESCE(P_updated_at, updated_at)
WHERE id = P_id
RETURNING id, title, author, created_at, updated_at;
END;
$$ LANGUAGE plpgsql;
