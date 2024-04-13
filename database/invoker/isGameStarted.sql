CREATE PROCEDURE isGameStarted(
    IN game_id_param INT,
    OUT game_started_param BOOLEAN
)
SQL SECURITY INVOKER
BEGIN
    DECLARE game_pile_count INT;

    SELECT COUNT(*) INTO game_pile_count
    FROM CardsGame
    WHERE game_pile_id IN (SELECT ID FROM GamePiles
												   WHERE GamePiles.game_id = game_id_param);

    SET game_started_param = (game_pile_count > 0);
END;