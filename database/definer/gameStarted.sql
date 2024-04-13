CREATE PROCEDURE gameStarted(
    IN game_id_param INT
)
COMMENT "(game_id) - Отображает, начата ли игра"
SQL SECURITY DEFINER
BEGIN
    DECLARE has_cards BOOLEAN;

    -- Check if there are any cards associated with the specified game
    SELECT CASE
        WHEN EXISTS (SELECT 1 FROM CardsGame cg INNER JOIN GamePiles gp ON cg.game_pile_id = gp.ID WHERE gp.game_id = game_id_param)
        THEN 'yes'
        ELSE 'no'
    END INTO has_cards;

    SELECT has_cards AS result;
END;