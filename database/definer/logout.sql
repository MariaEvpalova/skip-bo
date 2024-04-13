CREATE PROCEDURE logout(
    IN login VARCHAR(30),
    IN password VARCHAR(255)
)
COMMENT "(логин, пароль) - выход из системы на одном устройстве"
SQL SECURITY DEFINER
BEGIN
    DECLARE hashed_pw VARCHAR(64);
    DECLARE user_exists INT;

    SET hashed_pw = hashing(password);

    SELECT COUNT(*) INTO user_exists
    FROM Users
    WHERE login = login AND password = hashed_pw;

    IF user_exists > 0 THEN
        SELECT "Вы успешно вышли из системы на одном устройстве" AS MESSAGE;
    ELSE
        SELECT "Неверный логин или пароль" AS ERROR;
    END IF;
END;