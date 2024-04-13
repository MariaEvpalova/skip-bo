CREATE PROCEDURE createGamePiles(IN game_id_param INT)
SQL SECURITY INVOKER
BEGIN
    DECLARE i INT DEFAULT 1;

    START TRANSACTION;
    WHILE i <= 4 DO
        INSERT INTO GamePiles (game_id) VALUES (game_id_param);
        SET i = i + 1;
    END WHILE;
    COMMIT;
END;
