CREATE PROCEDURE assignStockPileForPlayer(player_id_param INT)
SQL SECURITY INVOKER
BEGIN
    DECLARE game_id_val INT;
    DECLARE num_players INT;
    DECLARE num_cards_to_add INT;
    DECLARE random_card_id INT;
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handler for any SQL error
        ROLLBACK;
        SELECT "An error occurred while assigning the stockpile." AS ERROR;
    END;

    START TRANSACTION;

    -- Get the game ID associated with the player
    SELECT game_id INTO game_id_val
    FROM Players
    WHERE ID = player_id_param;

    -- Get the number of players in the game
    SELECT Games.num_players INTO num_players
    FROM Games
    WHERE ID = game_id_val;

    -- Determine the number of cards to add based on the number of players
    IF num_players = 2 THEN
        SET num_cards_to_add = 20;
    ELSEIF num_players IN (3, 4) THEN
        SET num_cards_to_add = 15;
    ELSEIF num_players IN (5, 6) THEN
        SET num_cards_to_add = 10;
    ELSE
        SET num_cards_to_add = 0;
    END IF;

    -- Create a temporary table to store card IDs
    CREATE TEMPORARY TABLE TempCardIDs (CARD_ID INT);
    
    -- Insert card IDs into the temporary table
    INSERT INTO TempCardIDs (CARD_ID)
    SELECT CARD_ID
    FROM CardsDraw
    WHERE game_id = game_id_val
    LIMIT num_cards_to_add;

    -- Assign cards to the player's stock pile
    INSERT INTO CardsStock (CARD_ID, player_id)
    SELECT CARD_ID, player_id_param
    FROM TempCardIDs;

    -- Delete assigned cards from the draw pile
    DELETE FROM CardsDraw
    WHERE CARD_ID IN (SELECT CARD_ID FROM TempCardIDs);

    -- Drop the temporary table
    DROP TEMPORARY TABLE IF EXISTS TempCardIDs;
    
    SELECT card_id INTO random_card_id
    FROM CardsDraw
    WHERE CardsDraw.game_id = game_id_val
    ORDER BY RAND()
    LIMIT 1;

    UPDATE Games
    SET Games.firstDraw = random_card_id
    WHERE ID = game_id_val;
		
		COMMIT;

    SELECT "Stock pile assigned successfully." AS MESSAGE;
END;