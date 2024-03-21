const HandToGameStates = {
    handCardPressed: false,
    cardID: null,
};

function HandToGame_handleHandCard(login, password, gameID, cardID) {
    HandToGameStates.handCardPressed = !HandToGameStates.handCardPressed;
    HandToGameStates.cardID = HandToGameStates.handCardPressed ? cardID : null;
}

function HandToGame_handleGamePile(login, password, gameID, gamePileID) {
    if (!HandToGameStates.handCardPressed) return;
    HandToGamePile(
        login,
        password,
        gameID,
        HandToGameStates.cardID,
        gamePileID
    );
    HandToGameStates.handCardPressed = false;
    HandToGameStates.cardID = null;
}

let StockToGameStates = {
    stockCardPressed: false,
    cardID: null,
};

function StockToGame_handleStockCard(login, password, gameID, cardID) {
    StockToGameStates.stockCardPressed = !StockToGameStates.stockCardPressed;
    StockToGameStates.cardID = StockToGameStates.stockCardPressed
        ? cardID
        : null;
}
function StockToGame_handleGamePile(login, password, gameID, gamePileID) {
    if (!StockToGameStates.stockCardPressed) return;
    StockToGamePile(
        login,
        password,
        gameID,
        StockToGameStates.cardID,
        gamePileID
    );
    StockToGameStates.stockCardPressed = false;
    StockToGameStates.cardID = null;
}

let DiscardToGameStates = {
    discardCardPressed: false,
    cardID: null,
};

function DiscardToGame_handleDiscardCard(login, password, gameID, cardID) {
    DiscardToGameStates.discardCardPressed =
        !DiscardToGameStates.discardCardPressed;
    DiscardToGameStates.cardID = DiscardToGameStates.discardCardPressed
        ? cardID
        : null;
}

function DiscardToGame_handleGamePile(login, password, gameID, gamePileID) {
    if (!DiscardToGameStates.discardCardPressed) return;
    DiscardToGamePile(
        login,
        password,
        gameID,
        DiscardToGameStates.cardID,
        gamePileID
    );
    DiscardToGameStates.discardCardPressed = false;
    DiscardToGameStates.cardID = null;
}
