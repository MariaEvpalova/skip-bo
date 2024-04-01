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

function waitingPlayersStage(login, password, gameID) {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    intervalId = setInterval(() => {
        displayMainDrawPile(login, password, gameID);
        displayOthersCards(login, password, gameID);
    }, 1000);
    setMessage('Ожидание игроков');
}

async function waitingTurnStage(login, password, gameID) {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    intervalId = setInterval(async () => {
        await displayGamePiles(login, password, gameID);
        await displayMainDrawPile(login, password, gameID);
        await displayOthersCards(login, password, gameID);
        const winner = await gameWinner(gameID);
        if (winner != null) loadOtherWinMessage(login, password, gameID);
        else {
            const isCurrent = await isCurrentPlayer(login, gameID);
            if (isCurrent) roundFirstPart(login, password, gameID);
        }
    }, 1000);
    setMessage('Ожидайте ход');
}

async function startGame(login, password, gameID) {
    if (intervalId !== null) {
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

let roundStarted = false;

async function roundFirstPart(login, password, gameID) {
    if (roundStarted) return;

    roundStarted = true;

    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }

    setTimeout(function () {
        removeStartGameButton();
        addFinishTurnButton(login, password, gameID);

        addHandToGameInteractions(login, password, gameID);
        addStockToGameInteractions(login, password, gameID);
        addDiscardToGameInteractions(login, password, gameID);

        setMessage('Ваш ход');
    }, 1000);
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

    setMessage('Положите карту в Discard');
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
    roundStarted = false;
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
