CREATE PROCEDURE cardHandToGamePile(
    IN user_login VARCHAR(30),
    IN user_password VARCHAR(255),
    IN game_id INT,
    IN card_id INT,
    IN game_pile_id INT
)
COMMENT "(user_login VARCHAR(30), user_password VARCHAR(255), game_id INT, card_id INT, game_pile_id INT) - Moves a card from a player's hand to the game pile."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_param INT;
    DECLARE hashed_password_val VARCHAR(255);
    DECLARE is_valid_password BOOLEAN;
    DECLARE is_suitable BOOLEAN;
    DECLARE is_current_player INT;
    DECLARE card_value_param INT;

    START TRANSACTION;

    -- Verify user login and password
    SELECT ID INTO player_id_param
    FROM Players
    WHERE Players.user_login = user_login AND Players.game_id = game_id;

    SELECT password INTO hashed_password_val
    FROM Users
    WHERE Users.login = user_login;

    SET is_valid_password = (hashed_password_val = hashing(user_password));

    -- Check if the password is valid
    IF is_valid_password THEN
        -- Check if the player exists and is a current player in the game
        SELECT COUNT(*) INTO is_current_player
        FROM CurrentPlayers
        WHERE PLAYER_ID = player_id_param;

        IF is_current_player > 0 THEN
            -- Check if the card exists in the player's hand
            IF EXISTS (
                SELECT 1
                FROM CardsInHand
                WHERE CardsInHand.CARD_ID = card_id AND CardsInHand.player_id = player_id_param
            ) THEN
                -- Check if the card is suitable for the game pile
                CALL checkCardSuitability(card_id, game_pile_id, is_suitable);

                -- If the card is suitable
                IF is_suitable THEN
                    -- Move the card to the game pile
                    DELETE FROM CardsGame
                    WHERE CardsGame.game_pile_id = game_pile_id;
										
										SELECT Cards.card_value INTO card_value_param
										FROM Cards
										WHERE Cards.ID = card_id;
										
										IF card_value_param != 12 THEN
		                    INSERT INTO CardsGame (CARD_ID, game_pile_id)
		                    VALUES (card_id, game_pile_id);
                    END IF;

                    DELETE FROM CardsInHand
                    WHERE CardsInHand.CARD_ID = card_id AND CardsInHand.player_id = player_id_param;

                    -- Add five cards to player's hand if no cards left
                    IF NOT EXISTS (
                        SELECT 1
                        FROM CardsInHand
                        WHERE CardsInHand.player_id = player_id_param
                    ) THEN
                        CALL addFiveCardsToPlayerHand(player_id_param);
                    END IF;

                    COMMIT;
                    SELECT "Card moved to game pile successfully." AS MESSAGE;
                ELSE
                    ROLLBACK;
                    SELECT "Cannot place the card." AS ERROR;
                END IF;
            ELSE
                ROLLBACK;
                SELECT "Card not found in player's hand." AS ERROR;
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