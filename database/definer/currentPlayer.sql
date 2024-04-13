CREATE PROCEDURE currentPlayer(
    IN game_id_param INT
)
COMMENT '(game_id) - Отображает имя пользователя текущего игрока в указанной игре и оставшееся ему время.'
SQL SECURITY DEFINER
BEGIN
    DECLARE current_player_login VARCHAR(30);
    DECLARE current_player_id INT;
    
    SELECT p.user_login INTO current_player_login
    FROM CurrentPlayers cp
    INNER JOIN Players p ON cp.PLAYER_ID = p.ID
    WHERE p.game_id = game_id_param;
    
    SELECT current_player_login AS current_player;
    
    SELECT p.ID INTO current_player_id
    FROM CurrentPlayers cp
    INNER JOIN Players p ON cp.PLAYER_ID = p.ID
    WHERE p.game_id = game_id_param;
    
    CALL displayTimeLeft(current_player_id);
END;