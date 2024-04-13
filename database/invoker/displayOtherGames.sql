CREATE PROCEDURE displayOtherGames(
    IN user_login_param VARCHAR(30)
)
SQL SECURITY INVOKER
BEGIN
    -- Adding a table name
    SELECT 'Other Games' AS Table_Name;

    -- Query to select games where the user is not an admin and is not a player
    SELECT G.ID, G.num_players, G.move_duration, COUNT(P.ID) AS current_players
    FROM Games G
    LEFT JOIN Players P ON G.ID = P.game_id
    WHERE G.ID NOT IN (
        SELECT GAME_ID
        FROM GameAdmins
        WHERE GameAdmins.user_login = user_login_param
    )
    AND NOT EXISTS (
        SELECT 1
        FROM Players
        WHERE Players.game_id = G.ID
        AND Players.user_login = user_login_param
    )
    GROUP BY G.ID
    HAVING current_players < G.num_players;
END;
