CREATE OR REPLACE FUNCTION sp_update_note(
    P_id INTEGER,
    P_title VARCHAR,
    P_content VARCHAR
) RETURNS TABLE (
    id INTEGER,
    title VARCHAR,
    content VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
DECLARE
    current_title VARCHAR;
    current_content VARCHAR;
BEGIN
    -- Check if the note exists
    SELECT n.title, n.content INTO current_title, current_content FROM notes n WHERE n.id = P_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Note with id % not found', P_id;
    END IF;

    -- If title is not null and different from current, check for duplicate
    IF P_title IS NOT NULL AND P_title <> current_title THEN
        IF EXISTS (SELECT 1 FROM notes n WHERE n.title = P_title) THEN
            RAISE EXCEPTION 'A note with the title "%" already exists', P_title;
        END IF;
    END IF;

    -- Update the note
    RETURN QUERY
    UPDATE notes
    SET 
        title = COALESCE(P_title, current_title),
        content = COALESCE(P_content, current_content),
        updated_at = CURRENT_TIMESTAMP
    WHERE notes.id = P_id
    RETURNING notes.id, notes.title, notes.content, notes.created_at, notes.updated_at;
END;
$$ LANGUAGE plpgsql;
