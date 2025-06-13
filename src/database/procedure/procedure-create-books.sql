
CREATE OR REPLACE FUNCTION create_books(
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
BEGIN 
-- check if notes  with the same title already exist
IF EXISTS (SELECT 1 FROM notes WHERE title = P_title) THEN
    RAISE EXCEPTION 'A note with the title "%" already exists', P_title;
END IF;

RETURN QUERY
INSERT INTO notes (title, author, created_at, updated_at)
VALUES (P_title, P_author, P_created_at, P_updated_at)  
RETURNING id, title, author, created_at, updated_at;
END;
$$ LANGUAGE plpgsql;