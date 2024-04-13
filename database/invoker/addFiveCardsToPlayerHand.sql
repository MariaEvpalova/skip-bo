CREATE PROCEDURE addFiveCardsToPlayerHand(player_id_param INT)
SQL SECURITY INVOKER
BEGIN
		DECLARE random_card_id INT;

    START TRANSACTION;

    INSERT INTO CardsInHand (CARD_ID, player_id)
    SELECT cd.CARD_ID, player_id_param
    FROM (SELECT CARD_ID
          FROM CardsDraw
          WHERE game_id = (SELECT game_id FROM Players WHERE ID = player_id_param)
          ORDER BY RAND()
          LIMIT 5) AS cd;

    DELETE FROM CardsDraw
    WHERE CARD_ID IN (SELECT CARD_ID FROM CardsInHand
									    WHERE CardsInHand.player_id = player_id_param);		    
									    
		SELECT card_id INTO random_card_id
    FROM CardsDraw
    WHERE CardsDraw.game_id = (SELECT game_id FROM Players WHERE ID = player_id_param)
    ORDER BY RAND()
    LIMIT 1;

    UPDATE Games
    SET Games.firstDraw = random_card_id
    WHERE ID = (SELECT game_id FROM Players WHERE ID = player_id_param);

    COMMIT;

    SELECT "5 cards added to player's hand and deleted from draw pile successfully." AS MESSAGE;
END;