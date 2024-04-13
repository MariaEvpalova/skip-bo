CREATE PROCEDURE displayUserAdminGames(
    IN user_login VARCHAR(30)
)
SQL SECURITY INVOKER
BEGIN
				SELECT 'Your created games' AS Table_Name;
        SELECT G.ID, G.num_players, G.move_duration, COUNT(P.ID) AS current_players
        FROM Games G
        LEFT JOIN Players P ON G.ID = P.game_id
        WHERE G.ID IN (
            SELECT GAME_ID
            FROM GameAdmins
            WHERE GameAdmins.user_login = user_login
        )
        GROUP BY G.ID;
END;