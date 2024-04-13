CREATE PROCEDURE putCardToDiscard(
    IN user_login VARCHAR(30),
    IN user_password VARCHAR(255),
    IN game_id INT,
    IN card_id INT
)
COMMENT "(user_login, user_password, game_id, card_id) - Помещает карту в стопку сброса."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_val INT;
    DECLARE hashed_password_val VARCHAR(255);
    DECLARE is_valid_password BOOLEAN;
    DECLARE card_in_hand_count INT;
    DECLARE discard_pile_id INT;
    DECLARE is_current_player INT;

    START TRANSACTION;
		
		
    SELECT Players.ID INTO player_id_val
    FROM Players
    WHERE Players.user_login = user_login AND Players.game_id = game_id;
    
    SELECT DiscardPiles.ID INTO discard_pile_id
	  FROM DiscardPiles
	  WHERE DiscardPiles.player_id = player_id_val;

    SELECT COUNT(*) INTO card_in_hand_count
    FROM CardsInHand
    WHERE CardsInHand.CARD_ID = card_id AND player_id = player_id_val;

    IF card_in_hand_count > 0 THEN
        SELECT password INTO hashed_password_val
        FROM Users
        WHERE LOGIN = user_login;

        SET is_valid_password = (hashed_password_val = hashing(user_password));

        IF is_valid_password THEN
	        SELECT COUNT(*) INTO is_current_player
					FROM CurrentPlayers
					WHERE PLAYER_ID = player_id_val;
					
					IF is_current_player > 0 THEN
        
            INSERT INTO CardsOrderDiscard (CARD_ID, DISCARD_PILE_ID, number_in_pile)
            VALUES (card_id, discard_pile_id, 0);

            DELETE FROM CardsInHand
            WHERE CardsInHand.CARD_ID = card_id AND player_id = player_id_val;

            IF NOT EXISTS (
                SELECT 1
                FROM CardsInHand
                WHERE player_id = player_id_val
            ) THEN
                CALL addFiveCardsToPlayerHand(player_id_val);
            END IF;

            COMMIT;
            CALL finishTurn(user_login, user_password, game_id);
            SELECT "Card successfully placed in the discard pile." AS MESSAGE;
          ELSE
						ROLLBACK;
						    SELECT "You are not a current player in this game." AS ERROR;
						END IF;
        ELSE
            ROLLBACK;
            SELECT "Invalid password. Unable to put the card in the discard pile." AS ERROR;
        END IF;
    ELSE
        ROLLBACK;
        SELECT "Card is not in the player's hand. Unable to put it in the discard pile." AS ERROR;
    END IF;
END;