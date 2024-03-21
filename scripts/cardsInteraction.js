function addHandToGameInteractions(login, password, gameID) {
    const cardButtons = document.querySelectorAll('#playerHand .cards button');
    cardButtons.forEach((button) => {
        if (button.id) {
            button.addEventListener('click', function () {
                HandToGame_handleHandCard(login, password, gameID, button.id);
            });
        }
    });

    const gamePileButtons = document.querySelectorAll('#gamePiles button');
    gamePileButtons.forEach((button) => {
        button.addEventListener('click', function () {
            HandToGame_handleGamePile(login, password, gameID, button.id);
        });
    });
}

function addStockToGameInteractions(login, password, gameID) {
    const stockButton = document.querySelector('.stock-card-button');
    stockButton.addEventListener('click', function () {
        StockToGame_handleStockCard(login, password, gameID, stockButton.id);
    });

    const gamePileButtons = document.querySelectorAll('#gamePiles button');
    gamePileButtons.forEach((button) => {
        button.addEventListener('click', function () {
            StockToGame_handleGamePile(login, password, gameID, button.id);
        });
    });
}

function addDiscardToGameInteractions(login, password, gameID) {
    const cardButtons = document.querySelectorAll('#discardCards button');
    cardButtons.forEach((button) => {
        if (button.id) {
            button.addEventListener('click', function () {
                DiscardToGame_handleDiscardCard(
                    login,
                    password,
                    gameID,
                    button.id
                );
            });
        }
    });

    const gamePileButtons = document.querySelectorAll('#gamePiles button');
    gamePileButtons.forEach((button) => {
        button.addEventListener('click', function () {
            DiscardToGame_handleGamePile(login, password, gameID, button.id);
        });
    });
}

function addHandToDiscardInteractions(login, password, gameID) {
    const cardButtons = document.querySelectorAll('#playerHand .cards button');
    cardButtons.forEach((button) => {
        if (button.id) {
            button.addEventListener('click', function () {
                HandToDiscard(login, password, gameID, button.id);
            });
        }
    });
}
