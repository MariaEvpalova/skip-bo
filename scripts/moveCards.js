async function HandToGamePile(login, password, gameID, cardID, gamePileID) {
    const data = await fetchData('cardHandToGamePile', [
        login,
        password,
        gameID,
        cardID,
        gamePileID,
    ]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        await displayPlayerHand(login, password, gameID);
        await displayGamePiles(login, password, gameID);

        const cardButtons = document.querySelectorAll(
            '#playerHand .cards button'
        );
        cardButtons.forEach((button) => {
            if (button.id) {
                button.addEventListener('click', function () {
                    HandToGame_handleHandCard(
                        login,
                        password,
                        gameID,
                        button.id
                    );
                });
            }
        });

        addGamePileListeners(login, password, gameID);
    }
}

async function StockToGamePile(login, password, gameID, cardID, gamePileID) {
    const data = await fetchData('firstStockToGamePile', [
        login,
        password,
        gameID,
        cardID,
        gamePileID,
    ]);
    console.log(data);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        const winner = await gameWinner(gameID);
        if (winner == login) {
            loadWinMessage(login, password, gameID);
        } else {
            await displayPlayerFirstStock(login, password, gameID);
            await displayGamePiles(login, password, gameID);

            const stockButton = document.querySelector('.stock-card-button');
            stockButton.addEventListener('click', function () {
                StockToGame_handleStockCard(
                    login,
                    password,
                    gameID,
                    stockButton.id
                );
            });

            addGamePileListeners(login, password, gameID);
        }
    }
}

async function DiscardToGamePile(login, password, gameID, cardID, gamePileID) {
    const data = await fetchData('cardDiscardToGamePile', [
        login,
        password,
        gameID,
        cardID,
        gamePileID,
    ]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        await displayPlayerDiscard(login, password, gameID);
        await displayGamePiles(login, password, gameID);

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

        addGamePileListeners(login, password, gameID);
    }
}

async function HandToDiscard(login, password, gameID, cardID) {
    const data = await fetchData('putCardToDiscard', [
        login,
        password,
        gameID,
        cardID,
    ]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        await displayPlayerHand(login, password, gameID);
        await displayPlayerDiscard(login, password, gameID);
        endTurn(login, password, gameID);
    }
}

function addGamePileListeners(login, password, gameID) {
    const gamePileButtons = document.querySelectorAll('#gamePiles button');
    gamePileButtons.forEach((button) => {
        button.addEventListener('click', function () {
            HandToGame_handleGamePile(login, password, gameID, button.id);
        });
    });
    gamePileButtons.forEach((button) => {
        button.addEventListener('click', function () {
            StockToGame_handleGamePile(login, password, gameID, button.id);
        });
    });
    gamePileButtons.forEach((button) => {
        button.addEventListener('click', function () {
            DiscardToGame_handleGamePile(login, password, gameID, button.id);
        });
    });
}
