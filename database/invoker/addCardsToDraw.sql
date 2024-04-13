CREATE PROCEDURE addCardsToDraw(
    IN game_id_param INT
)
SQL SECURITY INVOKER
BEGIN
    DECLARE random_card_id INT;

    INSERT INTO CardsDraw (card_id, game_id)
    SELECT ID, game_id_param
    FROM Cards
    WHERE Cards.game_id = game_id_param;

    SELECT card_id INTO random_card_id
    FROM CardsDraw
    WHERE game_id = game_id_param
    ORDER BY RAND()
    LIMIT 1;

    UPDATE Games
    SET firstDraw = random_card_id
    WHERE ID = game_id_param;

    SELECT "Cards added to CardsDraw successfully" AS MESSAGE;
END;