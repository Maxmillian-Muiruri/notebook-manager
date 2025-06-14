
-- FETCH ALL notes
CREATE OR REPLACE  FUNCTION sp_get_all_notes()
RETURNS SETOF notes AS $$
BEGIN 
RETURN QUERY SELECT * FROM notes ORDER BY id DESC;
END;
$$ LANGUAGE plpgsql;

--Get a single note by its ID 

CREATE OR REPLACE FUNCTION sp_get_notes_by_id(p_id INTEGER)
RETURNS SETOF notes AS $$
BEGIN
    RETURN QUERY SELECT * FROM notes WHERE id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Note with id % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get notes by title
CREATE OR REPLACE FUNCTION sp_get_notes_by_title(p_title VARCHAR)
RETURNS SETOF notes AS $$
BEGIN
    RETURN QUERY SELECT * FROM notes WHERE title ILIKE '%' || p_title || '%';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No notes found with title %', p_title;
    END IF;
END;
$$ LANGUAGE plpgsql;

