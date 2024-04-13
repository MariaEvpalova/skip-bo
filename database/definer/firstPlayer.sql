CREATE PROCEDURE firstPlayer(
    IN game_id_param INT
)
COMMENT '(game_id) - Отображает имя пользователя первого вошедшего игрока в указанной игре.'
SQL SECURITY DEFINER
BEGIN
    DECLARE first_player_login VARCHAR(30);
    
    SELECT user_login INTO first_player_login
    FROM Players
    WHERE join_order = (SELECT MIN(join_order) FROM Players WHERE game_id = game_id_param)
			    AND Players.game_id = game_id_param;
    
    SELECT first_player_login AS first_player;
END;