CREATE PROCEDURE deleteGame(
    IN game_id INT,
    IN login VARCHAR(30),
    IN password VARCHAR(255)
)
COMMENT "(game_id INT, login VARCHAR(30), password VARCHAR(255)) - Удаляет игру, если пользователь является администратором игры."
SQL SECURITY DEFINER
BEGIN
    DECLARE admin_login VARCHAR(30);

    START TRANSACTION;

    -- Check if the login and password are valid
    SELECT LOGIN INTO admin_login
    FROM Users
    WHERE Users.LOGIN = login AND Users.password = hashing(password);

    IF admin_login IS NOT NULL THEN
        -- Check if the user is a game admin for the specified game
        IF EXISTS (
            SELECT 1
            FROM GameAdmins
            WHERE GameAdmins.GAME_ID = game_id AND user_login = admin_login
        ) THEN
            -- Delete the game admin entry and the game itself
            DELETE FROM GameAdmins
            WHERE GameAdmins.GAME_ID = game_id AND user_login = admin_login;

            DELETE FROM Games WHERE ID = game_id;

            COMMIT;
            SELECT "Game deleted successfully" AS MESSAGE;
        ELSE
            ROLLBACK;
            SELECT "User is not a game admin for this game" AS ERROR;
        END IF;
    ELSE
        ROLLBACK;
        SELECT "Authentication failed" AS ERROR;
    END IF;
END;