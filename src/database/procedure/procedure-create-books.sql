CREATE OR REPLACE FUNCTION sp_create_note(
    P_title VARCHAR,
    P_content VARCHAR
) RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    content VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    -- Check for duplicate title
    IF EXISTS (SELECT 1 FROM notes n WHERE n.title = P_title) THEN
        RAISE EXCEPTION 'A note with the title "%" already exists', P_title;
    END IF;

    RETURN QUERY
    INSERT INTO notes (title, content)
    VALUES (P_title, P_content)
    RETURNING notes.id, notes.title, notes.content, notes.created_at, notes.updated_at;
END;
$$ LANGUAGE plpgsql;