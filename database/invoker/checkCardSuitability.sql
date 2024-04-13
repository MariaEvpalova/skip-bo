CREATE PROCEDURE checkCardSuitability(
    IN card_id_param INT,
    IN pile_id_param INT,
    OUT is_suitable BOOLEAN
)
SQL SECURITY INVOKER
BEGIN
    DECLARE current_card_number INT;
    DECLARE last_card_number INT;
    DECLARE pile_card_count INT;

    SELECT card_value INTO current_card_number
    FROM Cards
    WHERE ID = card_id_param;

    SELECT COUNT(*) INTO pile_card_count
    FROM CardsGame
    WHERE game_pile_id = pile_id_param;
    
    SELECT card_value INTO last_card_number
    FROM Cards
    JOIN CardsGame ON Cards.ID = CardsGame.CARD_ID
    WHERE CardsGame.game_pile_id = pile_id_param
    LIMIT 1;
		
    IF pile_card_count = 0 THEN
        SET is_suitable = TRUE;
		ELSEIF last_card_number = 0 THEN
				SET is_suitable = TRUE;
    ELSEIF pile_card_count > 0 THEN

        IF current_card_number = last_card_number + 1 OR current_card_number = 0 THEN
            SET is_suitable = TRUE;
        ELSE
            SET is_suitable = FALSE;
        END IF;
    ELSE
        SET is_suitable = FALSE;
    END IF;
END;