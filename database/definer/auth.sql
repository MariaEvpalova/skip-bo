CREATE PROCEDURE auth(
	IN lg VARCHAR(30),
	IN pw VARCHAR(255)
)
	COMMENT "(логин, пароль) - авторизация пользователя."
BEGIN
	DECLARE hashed_pw VARCHAR(64);
	SELECT hashing(pw) INTO hashed_pw;

	IF EXISTS (SELECT 1 FROM Users WHERE login = lg AND password = hashed_pw) THEN 
		SELECT "Авторизация прошла успешно" AS MESSAGE;
		CALL displayUserAdminGames(lg);
		CALL displayUserPlayerGames(lg);
		CALL displayOtherGames(lg);
	ELSE
		SELECT "Пароль или логин неверный" AS ERROR;
	END IF;
END;