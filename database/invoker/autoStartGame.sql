CREATE PROCEDURE autoStartGame(
    IN game_id_param INT
)
COMMENT "(game_id_param INT) - Automatically starts the game by adding a player with the minimum join_order to CurrentPlayers."
SQL SECURITY INVOKER
BEGIN
    DECLARE min_join_order INT;
    DECLARE min_join_order_player_id INT;

    -- Find the player with the minimum join_order
    SELECT MIN(join_order) INTO min_join_order
    FROM Players
    WHERE game_id = game_id_param;

    -- Find the player ID with the minimum join_order
    SELECT ID INTO min_join_order_player_id
    FROM Players
    WHERE game_id = game_id_param AND join_order = min_join_order;

    -- Add the player with the minimum join_order to CurrentPlayers
    INSERT INTO CurrentPlayers (PLAYER_ID, startTime)
    VALUES (min_join_order_player_id, NOW());

    SELECT "Game started automatically. Player added to CurrentPlayers." AS MESSAGE;
END;