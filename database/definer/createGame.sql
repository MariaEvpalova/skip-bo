CREATE PROCEDURE createGame(
    IN num_players INT,
    IN move_duration INT,
    IN login VARCHAR(30),
    IN password VARCHAR(255)
)
COMMENT "(num_players INT, move_duration TIME, login VARCHAR(30), password VARCHAR(255)) - Creates a new game with specified parameters and assigns the user as the game administrator."
SQL SECURITY DEFINER
BEGIN
    DECLARE admin_login VARCHAR(30); 
    DECLARE game_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback transaction on error
        ROLLBACK;
        SELECT "An error occurred. Transaction rolled back." AS ERROR;
    END;

    IF num_players >= 2 AND num_players <= 6 THEN
        START TRANSACTION;

        SELECT LOGIN INTO admin_login
        FROM Users
        WHERE Users.LOGIN = login AND Users.password = hashing(password);

        IF admin_login IS NOT NULL THEN
            INSERT INTO Games(num_players, move_duration)
            VALUES (num_players, SEC_TO_TIME(move_duration));

            SET game_id = LAST_INSERT_ID();

            INSERT INTO GameAdmins(GAME_ID, user_login)
            VALUES (game_id, admin_login);
					
            CALL addCardsToGame(game_id);
            CALL addCardsToDraw(game_id);
            CALL createGamePiles(game_id);

            -- Commit transaction if all operations are successful
            COMMIT;
            SELECT "Game created successfully" AS MESSAGE, game_id AS GAME_ID;
        ELSE
            -- Rollback transaction if authentication fails
            ROLLBACK;
            SELECT "Authentication failed. Unable to create a game." AS ERROR;
        END IF;
    ELSE
        SELECT "Invalid number of players. The game must have between 2 and 6 players." AS ERROR;
    END IF;
END;