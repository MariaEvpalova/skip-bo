CREATE PROCEDURE displayUserPlayerGames(
    IN user_login_param VARCHAR(30)
)
SQL SECURITY INVOKER
BEGIN
    SELECT "Games you're a player in" AS Table_Name;

    SELECT G.ID, G.num_players, G.move_duration, COUNT(P.ID) AS current_players
    FROM Games G
    INNER JOIN Players P ON G.ID = P.game_id
    WHERE P.user_login = user_login_param
    GROUP BY G.ID;
END;