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

function addButtonsFunctions(login, password, gameID) {
    document
        .getElementById('exit')
        .addEventListener('click', () => exitGame(login, password, gameID));
    document
        .getElementById('finishButton')
        .addEventListener('click', () =>
            initSecondPart(login, password, gameID)
        );
}

function addFinishButton(login, password, gameID) {
    var playerNameElement = document.getElementById('playerName');

    var finishButton = document.createElement('button');
    finishButton.id = 'finishButton';
    finishButton.textContent = 'Закончить ход';

    playerNameElement.appendChild(finishButton);

    document
        .getElementById('finishButton')
        .addEventListener('click', () =>
            initSecondPart(login, password, gameID)
        );
}

function removeFinishButton() {
    var finishButton = document.getElementById('finishButton');
    if (finishButton) finishButton.parentNode.removeChild(finishButton);
}

async function exitGame(login, password, gameID) {
    const data = await fetchData('exitGame', [gameID, login, password]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        setupGamePage(login, password);
    }
}
