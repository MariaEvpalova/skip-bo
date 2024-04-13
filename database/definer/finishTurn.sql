CREATE PROCEDURE finishTurn(
    IN login_param VARCHAR(30),
    IN password_param VARCHAR(255),
    IN game_id_param INT
)
COMMENT "(login_param VARCHAR(30), password_param VARCHAR(255), game_id_param INT) - Completes the turn for the specified player in the game."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_val INT;
    DECLARE hashed_password_val VARCHAR(255);
    DECLARE is_valid_password BOOLEAN;
    DECLARE next_player_id INT;
    DECLARE max_players INT;
    DECLARE join_order_val INT;
    DECLARE next_join_order INT;
    DECLARE is_current_player INT;

    START TRANSACTION;

    -- Check if the provided login and password are valid
    SELECT ID INTO player_id_val
    FROM Players
    WHERE user_login = login_param AND game_id = game_id_param;

    SELECT password INTO hashed_password_val
    FROM Users
    WHERE login = login_param;

    SET is_valid_password = (hashed_password_val = hashing(password_param));

    IF is_valid_password THEN
		    
		    SELECT COUNT(*) INTO is_current_player
				FROM CurrentPlayers
				WHERE PLAYER_ID = player_id_val;
					
				IF is_current_player > 0 THEN
        -- Delete the player from the list of current players
        DELETE FROM CurrentPlayers
        WHERE PLAYER_ID = player_id_val;

        -- Get the maximum number of players allowed in the game
        SELECT num_players INTO max_players
        FROM Games
        WHERE ID = game_id_param;

        -- Get the join order of the player who just finished the turn
        SELECT join_order INTO join_order_val
        FROM Players
        WHERE ID = player_id_val;

        -- Determine the next player's join order
				IF join_order_val = (SELECT MAX(join_order) FROM Players WHERE game_id = game_id_param) THEN
            -- If the current player has the highest join_order, the next player is the one with the lowest join_order
            SELECT MIN(join_order) INTO next_join_order
            FROM Players
            WHERE game_id = game_id_param;
        ELSE
            -- Otherwise, get the player with the next join_order value
            SELECT MIN(join_order) INTO next_join_order
            FROM Players
            WHERE game_id = game_id_param AND join_order > join_order_val;
        END IF;
				
				SELECT ID INTO next_player_id
				FROM Players
				WHERE game_id = game_id_param AND join_order = next_join_order;
				
        -- Insert the next player into the list of current players
        INSERT IGNORE INTO CurrentPlayers (PLAYER_ID, startTime) 
        VALUES (next_player_id, NOW());

        COMMIT;
        SELECT "Turn finished successfully." AS MESSAGE;
      ELSE
			ROLLBACK;
				SELECT "You are not a current player in this game." AS ERROR;
			END IF;
    ELSE
        ROLLBACK;
        SELECT "Invalid password. Turn cannot be finished." AS ERROR;
    END IF;
END;
