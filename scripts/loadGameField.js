function initGameField() {
    document.body.innerHTML = '';
    document.body.id = 'gameField';
    document.body.className = '';

    const newContent = `
        <header><button id='exit'>Выйти</button></header>
        <main>
            <div id="otherPlayersCards"></div>
            <div id="mainPiles">
                <div id="gamePiles"></div>
                <div id="drawPile">
                    <h2>Main Draw Pile</h2>
                </div>
            </div>
            <div id="playerHand">
                <div class="cards"></div>
                <div id="playerName">
                    <h2>PlayerName hand</h2>
                </div>
            </div>
            <div id="StockDiscard">
                <div id="stock"></div>
                <div>
                    <div id="discardCards"></div>
                    <h2>Discard</h2>
                </div>
            </div>
        </main>
    `;

    document.body.innerHTML = newContent;
}

async function addButtonsFunctions(login, password, gameID) {
    document
        .getElementById('exit')
        .addEventListener('click', () => exitGame(login, password, gameID));

    const isFirst = await isFirstPlayer(login, gameID);
    const started = await gameStarted(gameID);
    if (isFirst && !started) addStartGameButton(login, password, gameID);
}

function addFinishTurnButton(login, password, gameID) {
    var playerNameElement = document.getElementById('playerName');

    var finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = 'Закончить ход';

    playerNameElement.appendChild(finishButton);

    document
        .getElementById('finishButton')
        .addEventListener('click', () =>
            roundSecondPart(login, password, gameID)
        );
}

function removeFinishTurnButton() {
    var finishButton = document.getElementById('finishButton');
    if (finishButton) finishButton.parentNode.removeChild(finishButton);
}

function addStartGameButton(login, password, gameID) {
    var playerNameElement = document.getElementById('playerName');

    var startGameButton = document.createElement('button');
    startGameButton.id = 'startGameButton';
    startGameButton.textContent = 'Начать игру';

    playerNameElement.appendChild(startGameButton);

    document
        .getElementById('startGameButton')
        .addEventListener('click', () => startGame(login, password, gameID));
}

function removeStartGameButton() {
    var startGameButton = document.getElementById('startGameButton');
    if (startGameButton)
        startGameButton.parentNode.removeChild(startGameButton);
}

function loadWinMessage(login, password, gameID) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const messageBox = document.createElement('div');
    messageBox.id = 'overlayMessage';
    messageBox.innerHTML = `
        <p>Поздравляем! Вы выиграли</p>
        <button id="exitButton">Выйти</button>
    `;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    document
        .getElementById('exitButton')
        .addEventListener('click', () => exitGame(login, password, gameID));
}

async function loadOtherWinMessage(login, password, gameID) {
    const winner = await gameWinner(gameID);

    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const messageBox = document.createElement('div');
    messageBox.id = 'overlayMessage';
    messageBox.innerHTML = `
        <p>${winner} победил</p>
        <button id="exitButton">Выйти</button>
    `;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    document
        .getElementById('exitButton')
        .addEventListener('click', () => exitGame(login, password, gameID));
}
