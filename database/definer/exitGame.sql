CREATE PROCEDURE exitGame(
    IN game_id INT,
    IN login VARCHAR(30),
    IN password VARCHAR(255)
)
COMMENT "(game_id INT, login VARCHAR(30), password VARCHAR(255)) - Позволяет игроку выйти из игры, требуя аутентификацию."
SQL SECURITY DEFINER
BEGIN
    DECLARE is_valid_user BOOLEAN;
    DECLARE is_player_in_game BOOLEAN;

    START TRANSACTION;

    -- Check if the provided login and password are valid
    SELECT EXISTS (
        SELECT 1
        FROM Users
        WHERE Users.login = login AND Users.password = hashing(password)
    ) INTO is_valid_user;

    IF is_valid_user THEN
        -- Check if the player is in the game
        SELECT EXISTS (
            SELECT 1
            FROM Players
            WHERE Players.game_id = game_id AND Players.user_login = login
        ) INTO is_player_in_game;

        IF is_player_in_game THEN
            -- Delete the player from the game
            DELETE FROM Players
            WHERE Players.game_id = game_id AND Players.user_login = login;

            IF ROW_COUNT() > 0 THEN
                COMMIT;
                SELECT "Player successfully exited the game." AS MESSAGE;
            ELSE
                ROLLBACK;
                SELECT "Player not found in the game or already exited." AS ERROR;
            END IF;
        ELSE
            ROLLBACK;
            SELECT "Player is not in the game." AS ERROR;
        END IF;
    ELSE
        ROLLBACK;
        SELECT "Invalid login or password. Unable to exit the game." AS ERROR;
    END IF;
END;