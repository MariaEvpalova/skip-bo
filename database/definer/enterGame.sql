CREATE PROCEDURE enterGame(
    IN game_id INT,
    IN login VARCHAR(30),
    IN password VARCHAR(255)
)
COMMENT "(game_id INT, login VARCHAR(30), password VARCHAR(255)) - Allows a user to enter a specific game."
SQL SECURITY DEFINER
BEGIN
    DECLARE user_exists INT;
    DECLARE is_game_admin INT;
    DECLARE current_players INT;
    DECLARE max_players INT;
    DECLARE game_started BOOLEAN;
    DECLARE is_player_exists INT;

    START TRANSACTION;

    -- Check if the user exists
    SELECT COUNT(*) INTO user_exists
    FROM Users
    WHERE Users.login = login AND Users.password = hashing(password);

    IF user_exists > 0 THEN
        -- Check if the player already exists in the game
        SELECT COUNT(*) INTO is_player_exists
        FROM Players
        WHERE Players.game_id = game_id AND Players.user_login = login;

        IF is_player_exists > 0 THEN
            COMMIT;
            SELECT "You are already a player in this game." AS MESSAGE;
        ELSE
            CALL isGameStarted(game_id, @game_started);

            IF NOT @game_started THEN
                -- Check the current number of players in the game
                SELECT COUNT(*) INTO current_players
                FROM Players
                WHERE Players.game_id = game_id;

                -- Get the maximum number of players allowed in the game
                SELECT num_players INTO max_players
                FROM Games
                WHERE Games.ID = game_id;

                IF current_players < max_players THEN
                    -- Add the player to the game
                    CALL addPlayerToGame(game_id, login);
                    
                    IF current_players + 1 = max_players THEN
                        CALL autoStartGame(game_id);
                    END IF;
                    
                    COMMIT;
                    SELECT "You have successfully entered the game." AS MESSAGE;
                ELSE
                    ROLLBACK;
                    SELECT "Cannot enter the game. Maximum number of players reached." AS ERROR;
                END IF;
            ELSE
                ROLLBACK;
                SELECT "Cannot enter the game. The game has already started." AS ERROR;
            END IF;
        END IF;
    ELSE
        ROLLBACK;
        SELECT "Authentication failed. Unable to enter the game." AS ERROR;
    END IF;
END;
