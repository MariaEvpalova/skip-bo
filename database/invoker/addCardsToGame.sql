CREATE PROCEDURE addCardsToGame(
    IN game_id_param INT
)
SQL SECURITY INVOKER
BEGIN
    START TRANSACTION;

    INSERT INTO Cards (card_value, card_color, game_id)
    SELECT card_value, card_color, game_id_param
    FROM Deck;

    COMMIT;
    SELECT "Skip-Bo cards added successfully" AS MESSAGE;
END;
