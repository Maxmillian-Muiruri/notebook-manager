-- Delete a note by its ID
CREATE OR REPLACE FUNCTION delete_note(p_id INTEGER)
RETURNS TABLE(success BOOLEAN, message TEXT, deleted_id INTEGER)
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_id INTEGER;
BEGIN
    DELETE FROM notes WHERE id = p_id RETURNING id INTO deleted_id;
    IF deleted_id IS NULL THEN
        RAISE EXCEPTION 'Note with id % not found', p_id;
    END IF;
    RETURN QUERY SELECT true, 'Note with id ' || deleted_id || ' deleted successfully', deleted_id;
END;
$$;