CREATE PROCEDURE firstStockToGamePile(
    IN user_login VARCHAR(30),
    IN user_password VARCHAR(255),
    IN game_id INT,
    IN card_id INT,
    IN game_pile_id INT
)
COMMENT "(user_login VARCHAR(30), user_password VARCHAR(255), game_id INT, card_id INT, game_pile_id INT) - Перемещает карту из руки игрока в игровую колоду."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_param INT;
    DECLARE hashed_password_val VARCHAR(255);
    DECLARE is_valid_password BOOLEAN;
		DECLARE player_first_stock_id INT;
		DECLARE random_stock_card_id INT;
		DECLARE is_suitable BOOLEAN;
		DECLARE is_current_player INT;
		DECLARE card_value_param INT;

    START TRANSACTION;

    SELECT Players.ID INTO player_id_param
    FROM Players
    WHERE Players.user_login = user_login AND Players.game_id = game_id;
		
		SELECT first_card_stock INTO player_first_stock_id
		FROM Players
		WHERE ID = player_id_param
		LIMIT 1;

    SELECT password INTO hashed_password_val
    FROM Users
    WHERE Users.login = user_login;

    SET is_valid_password = (hashed_password_val = hashing(user_password));

    IF is_valid_password THEN
			 SELECT COUNT(*) INTO is_current_player
       FROM CurrentPlayers
       WHERE PLAYER_ID = player_id_param;

       IF is_current_player > 0 THEN
    					
		       CALL checkCardSuitability(card_id, game_pile_id, is_suitable);
		       IF is_suitable THEN
				       	DELETE FROM CardsGame
								WHERE CardsGame.game_pile_id = game_pile_id;
								
								SELECT Cards.card_value INTO card_value_param
								FROM Cards
								WHERE Cards.ID = card_id;
								
								IF card_value_param != 12 THEN
										INSERT INTO CardsGame (CARD_ID, game_pile_id)
				            VALUES (player_first_stock_id, game_pile_id);
								END IF;
								
		
								IF EXISTS (
				            SELECT 1
				            FROM CardsStock
				            WHERE CardsStock.player_id = player_id_param
				        ) THEN
										SELECT CardsStock.CARD_ID INTO random_stock_card_id
								    FROM CardsStock
								    WHERE CardsStock.PLAYER_ID = player_id_param
								    ORDER BY RAND()
								    LIMIT 1;
										
										UPDATE Players
								    SET Players.first_card_stock = random_stock_card_id
								    WHERE Players.ID = player_id_param;
		
										DELETE FROM CardsStock
										WHERE CardsStock.CARD_ID = random_stock_card_id;
		
		                COMMIT;
										SELECT "Card moved to game pile successfully." AS MESSAGE;
								ELSE
										UPDATE Games
										SET Games.winner = user_login
										WHERE Games.ID = game_id;
		                COMMIT;
										SELECT "You won! Congrats!" AS WIN;
								END IF;
		       ELSE
		           ROLLBACK;
		           SELECT "Нельзя поставить карту" AS ERROR;
		       END IF;
		     ELSE
				    ROLLBACK;
           SELECT "You are not a current player in this game." AS ERROR;
        END IF;
    ELSE
        ROLLBACK;
        SELECT "Invalid password. Cannot transfer card." AS ERROR;
    END IF;
END;