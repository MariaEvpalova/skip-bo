async function enterGame(login, password, gameID) {
    initGameField();
    await displayPlayerHand(login, password, gameID);
    await displayPlayerDiscard(login, password, gameID);
    await displayPlayerFirstStock(login, password, gameID);
    await displayGamePiles(login, password, gameID);
    await displayMainDrawPile(login, password, gameID);
    await displayOthersCards(login, password, gameID);
    addButtonsFunctions(login, password, gameID);
}

async function gameStarted(gameID) {
    const data = await fetchData('gameStarted', [gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
    else return Boolean(data['RESULTS'][0]['result'][0]);
}

async function isFirstPlayer(login, gameID) {
    const data = await fetchData('firstPlayer', [gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
    else return data['RESULTS'][0]['irst_player'][0] == login;
}

async function isCurrentPlayer(login, gameID) {
    const data = await fetchData('currentPlayer', [gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
    else return data['RESULTS'][0]['current_player'][0] == login;
}

async function initFirstPart(login, password, gameID) {
    addHandToGameInteractions(login, password, gameID);
    addStockToGameInteractions(login, password, gameID);
    addDiscardToGameInteractions(login, password, gameID);
}

function initSecondPart(login, password, gameID) {
    document
        .querySelectorAll('#playerHand .cards button')
        .forEach((element) => {
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });

    document.querySelector('.stock-card-button').forEach((element) => {
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

    const element = document.getElementById('finishButton');
    const newElement = element.cloneNode(true);
    element.parentNode.replaceChild(newElement, element);

    addHandToDiscardInteractions(login, password, gameID);
}

async function endTurn(login, password, gameID) {
    const data = await fetchData('finishTurn', [login, password, gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
}
