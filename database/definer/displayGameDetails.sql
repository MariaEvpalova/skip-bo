CREATE PROCEDURE displayGameDetails(
    IN user_login_param VARCHAR(30),
    IN user_password_param VARCHAR(255),
    IN game_id_param INT
)
COMMENT "(login VARCHAR(30), password VARCHAR(255), game_id INT) - Отображает информацию о текущем состоянии игры."
SQL SECURITY DEFINER
BEGIN
    DECLARE player_id_param INT;

    -- Get the player ID based on the provided user login, password, and game ID
    SELECT ID INTO player_id_param
    FROM Players
    WHERE Players.user_login = user_login_param AND Players.game_id = game_id_param;

    CALL currentPlayer(game_id_param);

    -- Call other procedures to display player's game details
    CALL showPlayerHandCards(user_login_param, user_password_param, game_id_param);
    CALL showPlayerDiscardCards(user_login_param, user_password_param, game_id_param);
    CALL showPlayerFirstStockCard(user_login_param, user_password_param, game_id_param);
    CALL countPlayerStockCards(user_login_param, user_password_param, game_id_param);
    CALL showGamePiles(user_login_param, user_password_param, game_id_param);
    CALL showMainDraw(user_login_param, user_password_param, game_id_param);
    CALL showOthersCards(user_login_param, user_password_param, game_id_param);
END;
