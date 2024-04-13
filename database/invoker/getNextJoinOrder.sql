CREATE FUNCTION getNextJoinOrder(game_id_param INT) RETURNS INT
SQL SECURITY INVOKER
BEGIN
    DECLARE next_join_order INT;

    SELECT COALESCE(MAX(join_order), 0) + 1 INTO next_join_order
    FROM Players
    WHERE game_id = game_id_param;

    RETURN next_join_order;
END;