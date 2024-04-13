CREATE PROCEDURE showGamePiles(
    IN user_login_param VARCHAR(30),
    IN user_password_param VARCHAR(255),
    IN game_id_param INT
)
COMMENT "(user_login_param VARCHAR(30), user_password_param VARCHAR(255), game_id_param INT) - Показывает карты в стопках игры."
SQL SECURITY DEFINER
BEGIN
    DECLARE is_valid_password BOOLEAN;

    -- Check if the provided login and password are valid
    SELECT COUNT(*) INTO is_valid_password
    FROM Users
    WHERE login = user_login_param AND password = hashing(user_password_param);

    -- If valid, proceed with retrieving game pile information
    IF is_valid_password THEN
        -- Select information about all game piles
        SELECT 
            GamePiles.ID AS game_pile_id, 
            (CASE WHEN CardsGame.CARD_ID IS NULL THEN NULL ELSE Cards.ID END) AS card_id,
            (CASE WHEN CardsGame.CARD_ID IS NULL THEN NULL ELSE Cards.card_value END) AS card_value
        FROM GamePiles
        LEFT JOIN CardsGame ON GamePiles.ID = CardsGame.game_pile_id
        LEFT JOIN Cards ON CardsGame.CARD_ID = Cards.ID
        WHERE GamePiles.game_id = game_id_param;
    ELSE
        -- If invalid login or password, return an error message
        SELECT "Invalid password or game ID. Cannot display game piles." AS ERROR;
    END IF;
END;