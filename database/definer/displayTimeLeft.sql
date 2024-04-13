CREATE PROCEDURE displayTimeLeft(
    IN player_id_param INT
)
COMMENT "(player_id) - Отображает время, оставшееся игроку для хода"
SQL SECURITY DEFINER
BEGIN
    DECLARE game_id_val INT;
    DECLARE move_duration TIME;
    DECLARE is_current_player INT;
    DECLARE remaining_time TIME;

    SELECT COUNT(*) INTO is_current_player
    FROM CurrentPlayers
    WHERE PLAYER_ID = player_id_param;
    
    SELECT Games.move_duration INTO move_duration
    FROM Games
    WHERE Games.ID IN (SELECT game_id FROM Players
                       WHERE Players.ID = player_id_param);

    IF is_current_player > 0 THEN
        -- Calculate the remaining time based on the start time and move duration
        SELECT TIMESTAMPDIFF(SECOND, startTime, NOW()) INTO @elapsed_seconds
        FROM CurrentPlayers
        WHERE PLAYER_ID = player_id_param;

        SET remaining_time = SEC_TO_TIME(TIME_TO_SEC(move_duration) - @elapsed_seconds);

        IF remaining_time IS NOT NULL THEN
		        IF TIME_TO_SEC(remaining_time) <= 0 THEN
                CALL playerTimeOut(player_id_param);
            END IF;
		        
            -- Return the remaining time as TIMELEFT
            SELECT remaining_time AS TIMELEFT;
        ELSE
            SELECT 'Error calculating remaining time' AS ERROR;
        END IF;
    ELSE
        SELECT 'You are not the current player' AS ERROR;
    END IF;
END;