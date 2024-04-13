CREATE PROCEDURE startGame(
    IN login_param VARCHAR(30),
    IN password_param VARCHAR(255),
    IN game_id_param INT
)
COMMENT "(login, password, gameID) - Начинает игру, если у игрока первый порядок присоединения."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_val INT;
    DECLARE hashed_password_val VARCHAR(255);
    DECLARE is_valid_password BOOLEAN;
    DECLARE first_player INT;

    -- Начало транзакции
    START TRANSACTION;

    -- Проверка логина и пароля
    SELECT ID INTO player_id_val
    FROM Players
    WHERE user_login = login_param AND game_id = game_id_param; -- Added game_id condition

    SELECT password INTO hashed_password_val
    FROM Users
    WHERE login = login_param;

    SET is_valid_password = (hashed_password_val = hashing(password_param));

    -- Если логин и пароль действительны
    IF is_valid_password THEN
        -- Проверка, имеет ли игрок первый порядок присоединения
        SELECT COUNT(*)
        INTO first_player
        FROM Players
        WHERE user_login = login_param AND game_id = game_id_param AND join_order = 1;

        -- Если у игрока первый порядок присоединения, добавить его в CurrentPlayers
        IF first_player > 0 THEN
            INSERT IGNORE INTO CurrentPlayers (PLAYER_ID, startTime)
            VALUES (player_id_val, NOW());
            COMMIT;
            SELECT "Игра успешно начата." AS MESSAGE;
        ELSE
            ROLLBACK;
            SELECT "У игрока нет первого порядка присоединения. Невозможно начать игру." AS ERROR;
        END IF;
    ELSE
        ROLLBACK;
        SELECT "Неверный логин или пароль." AS ERROR;
    END IF;
END;
