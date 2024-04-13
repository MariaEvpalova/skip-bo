CREATE PROCEDURE gameWinner(
    IN game_id_param INT
)
COMMENT "(game_id) - Показывает победителя текущей игры."
SQL SECURITY DEFINER
BEGIN
		DECLARE winner VARCHAR(30);
		
		SELECT Games.winner INTO winner
		FROM Games
		WHERE Games.ID = game_id_param;
		
		SELECT winner AS WINNER;
END;