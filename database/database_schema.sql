CREATE TABLE Games (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    num_players INT NOT NULL,
    move_duration TIME NOT NULL,
    firstDraw INT,
    winnner VARCHAR(30)
);

CREATE TABLE Cards (
    ID INT AUTO_INCREMENT PRIMARY KEY,
	card_value INT NOT NULL,
	card_color INT NOT NULL,
	game_id INT NOT NULL,
        FOREIGN KEY (game_id) REFERENCES Games(ID) ON DELETE CASCADE
);

CREATE TABLE Users (
	LOGIN VARCHAR(30) PRIMARY KEY,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE Players (
    ID INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(20) NOT NULL,
	user_login VARCHAR(30) NOT NULL,
    game_id INT NOT NULL,
	join_order INT NOT NULL,
	first_card_stock INT NOT NULL,
		UNIQUE (game_id, join_order),
		FOREIGN KEY (game_id) REFERENCES Games(ID) ON DELETE CASCADE,
		FOREIGN KEY (first_card_stock) REFERENCES Cards(ID) ON DELETE CASCADE,
		FOREIGN KEY (user_login) REFERENCES Users(LOGIN) ON DELETE CASCADE
);

CREATE TABLE DiscardPiles (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	player_id INT NOT NULL,
        FOREIGN KEY (player_id) REFERENCES Players(ID) ON DELETE CASCADE
);

CREATE TABLE CardsOrderDiscard (
	CARD_ID INT,
	DISCARD_PILE_ID INT,
    number_in_pile INT NOT NULL,
		PRIMARY KEY(CARD_ID, DISCARD_PILE_ID),
		FOREIGN KEY (CARD_ID) REFERENCES Cards(ID) ON DELETE CASCADE,
		FOREIGN KEY (DISCARD_PILE_ID) REFERENCES DiscardPiles(ID) ON DELETE CASCADE
);

CREATE TABLE CardsInHand (
	CARD_ID INT PRIMARY KEY,
	player_id INT NOT NULL,
		FOREIGN KEY (CARD_ID) REFERENCES Cards(ID) ON DELETE CASCADE,
		FOREIGN KEY (player_id) REFERENCES Players(ID) ON DELETE CASCADE
);

CREATE TABLE CardsStock (
	CARD_ID INT PRIMARY KEY,
	player_id INT NOT NULL,
		FOREIGN KEY (CARD_ID) REFERENCES Cards(ID) ON DELETE CASCADE,
		FOREIGN KEY (player_id) REFERENCES Players(ID) ON DELETE CASCADE
);

CREATE TABLE UserPlayers (
	PLAYER_ID INT PRIMARY KEY,
	user_login VARCHAR(30) NOT NULL,
		FOREIGN KEY (PLAYER_ID) REFERENCES Players(ID) ON DELETE CASCADE,
		FOREIGN KEY (user_login) REFERENCES Users(LOGIN) ON DELETE CASCADE
);

CREATE TABLE CurrentPlayers (
	PLAYER_ID INT PRIMARY KEY,
	startTime TIMESTAMP,
		FOREIGN KEY (PLAYER_ID) REFERENCES Players(ID)ON DELETE CASCADE
);

CREATE TABLE GamePiles (
	ID INT AUTO_INCREMENT PRIMARY KEY,
	game_id INT NOT NULL,
		FOREIGN KEY (game_id) REFERENCES Games(ID) ON DELETE CASCADE
);

CREATE TABLE CardsGame (
	CARD_ID INT PRIMARY KEY,
	game_pile_id INT NOT NULL,
		FOREIGN KEY (CARD_ID) REFERENCES Cards(ID) ON DELETE CASCADE,
		FOREIGN KEY (game_pile_id) REFERENCES GamePiles(ID) ON DELETE CASCADE
);

CREATE TABLE CardsDraw (
	CARD_ID INT PRIMARY KEY,
	game_id INT NOT NULL,
		FOREIGN KEY (CARD_ID) REFERENCES Cards(ID) ON DELETE CASCADE,
		FOREIGN KEY (game_id) REFERENCES Games(ID) ON DELETE CASCADE
);

CREATE TABLE GameAdmins (
	GAME_ID INT PRIMARY KEY,
	user_login VARCHAR(30) NOT NULL,
		FOREIGN KEY (GAME_ID) REFERENCES Games(ID) ON DELETE CASCADE,
		FOREIGN KEY (user_login) REFERENCES Users(LOGIN) ON DELETE RESTRICT
);