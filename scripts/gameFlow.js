async function enterGameFlow(login, password, gameID) {
    initGameField();
    await updateScreen(login, password, gameID);
    await addButtonsFunctions(login, password, gameID);

    const isFirst = await isFirstPlayer(login, gameID);
    const started = await gameStarted(gameID);
    if (isFirst && !started) waitingPlayersStage(login, password, gameID);
    else waitingTurnStage(login, password, gameID);
}

async function updateScreen(login, password, gameID) {
    await displayPlayerHand(login, password, gameID);
    await displayPlayerDiscard(login, password, gameID);
    await displayPlayerFirstStock(login, password, gameID);
    await displayGamePiles(login, password, gameID);
    await displayMainDrawPile(login, password, gameID);
    await displayOthersCards(login, password, gameID);
}

let intervalId = null;
/*
    if (intervalId === null) {
        // Prevent multiple intervals from being created
        intervalId = setInterval(() => {
            console.log('This function is executed every 1 second');
        }, 1000);
        console.log('Interval started.');
    }
*/
/*
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null; // Reset the intervalId
        console.log('Interval stopped.');
    }
*/

function waitingPlayersStage(login, password, gameID) {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    intervalId = setInterval(() => {
        updateScreen(login, password, gameID);
    }, 1000);
}

async function waitingTurnStage(login, password, gameID) {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    intervalId = setInterval(async () => {
        const winner = await gameWinner(gameID);
        if (winner != null) loadOtherWinMessage(login, password, gameID);
        else {
            const isCurrent = await isCurrentPlayer(login, gameID);
            if (isCurrent) roundFirstPart(login, password, gameID);
        }
    }, 1000);
}

async function startGame(login, password, gameID) {
    if (intervalId !== null) {
        console.log('clear interval in start game');
        clearInterval(intervalId);
        intervalId = null;
    }

    const data = await fetchData('startGame', [login, password, gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
    else {
        console.log('starting round');
        roundFirstPart(login, password, gameID);
    }
}

async function roundFirstPart(login, password, gameID) {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }

    removeStartGameButton();
    addFinishTurnButton(login, password, gameID);

    addHandToGameInteractions(login, password, gameID);
    addStockToGameInteractions(login, password, gameID);
    addDiscardToGameInteractions(login, password, gameID);
}

function roundSecondPart(login, password, gameID) {
    document
        .querySelectorAll('#playerHand .cards button')
        .forEach((element) => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });

    document.querySelectorAll('.stock-card-button').forEach((element) => {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
    });

    document.querySelectorAll('#discardCards button').forEach((element) => {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
    });

    document.querySelectorAll('#gamePiles button').forEach((element) => {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
    });
    removeFinishTurnButton();

    addHandToDiscardInteractions(login, password, gameID);
}

async function endTurn(login, password, gameID) {
    const data = await fetchData('finishTurn', [login, password, gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);

    document
        .querySelectorAll('#playerHand .cards button')
        .forEach((element) => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
    waitingTurnStage(login, password, gameID);
}

async function exitGame(login, password, gameID) {
    const data = await fetchData('exitGame', [gameID, login, password]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
        setupGamePage(login, password);
    }
}
