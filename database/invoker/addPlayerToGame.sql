CREATE PROCEDURE addPlayerToGame(
    IN game_id_param INT,
    IN login VARCHAR(30)
)
SQL SECURITY INVOKER
BEGIN
    DECLARE player_exists INT DEFAULT 0;
    DECLARE next_join_order INT DEFAULT 0;
    DECLARE new_player_id INT;
    DECLARE random_card_id INT;
    DECLARE random_stock_card_id INT;

    SELECT COUNT(*) INTO player_exists
    FROM Players
    WHERE user_login = login AND game_id = game_id_param;

    IF player_exists > 0 THEN
        SELECT "Player already exists in this game." AS MESSAGE;
    ELSE
        START TRANSACTION;

        SET next_join_order = (SELECT getNextJoinOrder(game_id_param));

        -- Insert player into Players table
        INSERT INTO Players (name, user_login, game_id, join_order, first_card_stock)
        VALUES (login, login, game_id_param, next_join_order, NULL);
        
        -- Get the new player's ID
        SET new_player_id = LAST_INSERT_ID();

        -- Insert player into UserPlayers table
        INSERT INTO UserPlayers (PLAYER_ID, user_login)
        VALUES (new_player_id, login);

        -- Additional setup for the player
        CALL assignStockPileForPlayer(new_player_id);
        
        SELECT CARD_ID INTO random_stock_card_id
				FROM CardsStock
				WHERE CardsStock.PLAYER_ID = new_player_id
				ORDER BY RAND()
				LIMIT 1;
								
				UPDATE Players
				SET first_card_stock = random_stock_card_id
				WHERE ID = new_player_id;

				DELETE FROM CardsStock
				WHERE CardsStock.CARD_ID = random_stock_card_id;
        
        CALL createDiscardPilesForPlayer(new_player_id);
        CALL addFiveCardsToPlayerHand(new_player_id);

        COMMIT;

        SELECT "Player added to the game successfully." AS MESSAGE;
    END IF;
END;
