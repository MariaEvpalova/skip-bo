CREATE PROCEDURE createDiscardPilesForPlayer(player_id_param INT)
SQL SECURITY INVOKER
BEGIN
    START TRANSACTION;

    INSERT INTO DiscardPiles (player_id)
    VALUES (player_id_param);

    COMMIT;

    SELECT "Discard pile created successfully." AS MESSAGE;
END;