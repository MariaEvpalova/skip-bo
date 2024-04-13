CREATE PROCEDURE playerTimeOut(
    IN player_id_val INT
)
SQL SECURITY INVOKER
BEGIN
    DECLARE next_player_id INT;
    DECLARE max_players INT;
    DECLARE join_order_val INT;
    DECLARE next_join_order INT;
    DECLARE game_id_param INT;

    START TRANSACTION;

        DELETE FROM CurrentPlayers
        WHERE PLAYER_ID = player_id_val;
        
        SELECT game_id INTO game_id_param
        FROM Players
        WHERE Players.ID = player_id_val;

        SELECT num_players INTO max_players
        FROM Games
        WHERE ID = game_id_param;

        SELECT join_order INTO join_order_val
        FROM Players
        WHERE ID = player_id_val;

				IF join_order_val = (SELECT MAX(join_order) FROM Players WHERE game_id = game_id_param) THEN
            -- If the current player has the highest join_order, the next player is the one with the lowest join_order
            SELECT MIN(join_order) INTO next_join_order
            FROM Players
            WHERE game_id = game_id_param;
        ELSE
            SELECT MIN(join_order) INTO next_join_order
            FROM Players
            WHERE game_id = game_id_param AND join_order > join_order_val;
        END IF;
				
				SELECT ID INTO next_player_id
				FROM Players
				WHERE game_id = game_id_param AND join_order = next_join_order;
				
        INSERT INTO CurrentPlayers (PLAYER_ID, startTime) 
        VALUES (next_player_id, NOW());

        COMMIT;
        SELECT "Turn finished successfully." AS MESSAGE;
END;