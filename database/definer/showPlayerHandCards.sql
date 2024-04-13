CREATE PROCEDURE showPlayerHandCards(
    IN user_login_param VARCHAR(30),
    IN user_password_param VARCHAR(255),
    IN game_id_param INT
)
COMMENT "(user_login VARCHAR(30), user_password VARCHAR(255), game_id_param INT) - Показывает карты в руке игрока."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_val INT;
    DECLARE hashed_password_val VARCHAR(255);
    DECLARE is_valid_password BOOLEAN;

    SELECT ID INTO player_id_val
    FROM Players
    WHERE user_login = user_login_param AND game_id = game_id_param;

    SELECT password INTO hashed_password_val
    FROM Users
    WHERE login = user_login_param;

    SET is_valid_password = (hashed_password_val = hashing(user_password_param));

    IF is_valid_password THEN
        SELECT 'Hand' AS CardSource, Cards.ID, Cards.card_value, Cards.card_color, Cards.game_id
        FROM Cards
        INNER JOIN CardsInHand ON Cards.ID = CardsInHand.CARD_ID
        WHERE CardsInHand.player_id = player_id_val;
    ELSE
        SELECT "Invalid password or game ID. Cannot display player's cards." AS ERROR;
    END IF;
END;