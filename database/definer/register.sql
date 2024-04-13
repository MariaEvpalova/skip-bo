CREATE PROCEDURE register(
    IN login VARCHAR(30),
    IN password VARCHAR(255)
)
COMMENT "(логин, пароль) - создает нового пользователя"
SQL SECURITY DEFINER
BEGIN
    DECLARE rows_affected INT;
    
    INSERT IGNORE INTO Users(login, password) VALUES(login, hashing(password));
    
    SELECT ROW_COUNT() INTO rows_affected;
    
    IF rows_affected = 0 THEN
        SELECT "Такой логин уже занят" AS ERROR;
    ELSE
        -- Call the auth procedure to authenticate the newly registered user
        CALL auth(login, password);
    END IF;
END;