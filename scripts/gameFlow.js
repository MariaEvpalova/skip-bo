async function displayPlayerHand(login, password, gameID) {
    try {
        const handData = await fetchData('showPlayerHandCards', [
            login,
            password,
            gameID,
        ]);
        const cardsData = handData['RESULTS'][0];

        let cardsHTML = '';

        for (let i = 0; i < cardsData.CardSource.length; i++) {
            const cardValue = cardsData.card_value[i];
            const cardID = cardsData.ID[i];
            const cardColor = cardsData.card_color[i];
            const cardSrc = `cards/${cardValue}.svg`;

            cardsHTML += `
                <button id="${cardID}">
                    <img src="${cardSrc}" alt="${cardColor} ${cardValue}" />
                </button>
            `;
        }

        document
            .getElementById('playerName')
            .querySelector('h2').textContent = `${login}'s hand`;

        document.querySelector('#playerHand .cards').innerHTML = cardsHTML;
    } catch (error) {
        console.error('Failed to display player hand:', error);
    }
}

async function displayPlayerDiscard(login, password, gameID) {
    try {
        const discardData = await fetchData('showPlayerDiscardCards', [
            login,
            password,
            gameID,
        ]);
        const cardsData = discardData['RESULTS'][0];

        let cardsHTML = '';

        for (let i = 0; i < cardsData.CardSource.length; i++) {
            const cardValue = cardsData.card_value[i];
            const cardID = cardsData.ID[i];
            const cardSrc = `cards/${cardValue}.svg`;

            cardsHTML += `
                <button id="${cardID}">
                    <img src="${cardSrc}" alt="" />
                </button>
            `;
        }

        document.querySelector('#discardCards').innerHTML = cardsHTML;
    } catch (error) {
        console.error('Failed to display discard cards:', error);
    }
}

async function displayPlayerFirstStock(login, password, gameID) {
    try {
        const firstStockData = await fetchData('showPlayerFirstStockCard', [
            login,
            password,
            gameID,
        ]);
        const cardData = firstStockData['RESULTS'][0];

        const cardID = cardData.ID[0];
        const cardSrc = `cards/${cardData.card_value[0]}.svg`;

        const stockCountData = await fetchData('countPlayerStockCards', [
            login,
            password,
            gameID,
        ]);
        const stockCount = stockCountData['RESULTS'][0].StockCardCount[0];

        const stockContainer = document.querySelector('#stock');
        stockContainer.innerHTML = `
            <button id="card_${cardID}" class="stock-card-button">
                <img src="${cardSrc}" alt="" />
            </button>
            <h2>${stockCount}</h2>
        `;
    } catch (error) {
        console.error('Failed to display first stock card and count:', error);
    }
}

async function displayGamePiles(login, password, gameID) {
    try {
        const pilesData = await fetchData('showGamePiles', [
            login,
            password,
            gameID,
        ]);
        const cardsData = pilesData['RESULTS'][0];

        let pilesHTML = '';

        for (let i = 0; i < cardsData.CardSource.length; i++) {
            const cardValue = cardsData.card_value[i];
            const cardSrc = `cards/${cardValue}.svg`;
            const pileID = cardsData.pile_id[i];

            pilesHTML += `
                <img src="${cardSrc}" alt="" class="building" id="pile_${pileID}" />
            `;
        }

        document.querySelector('#gamePiles').innerHTML = pilesHTML;
    } catch (error) {
        console.error('Failed to display game piles:', error);
    }
}

async function displayMainDrawPile(login, password, gameID) {
    try {
        const drawPileData = await fetchData('showMainDraw', [
            login,
            password,
            gameID,
        ]);
        const cardData = drawPileData['RESULTS'][0];

        if (cardData.ID && cardData.ID.length > 0) {
            const cardID = cardData.ID[0];
            const cardValue = cardData.card_value[0];
            const cardSrc = `cards/${cardValue}.svg`;

            const newImg = document.createElement('img');
            newImg.src = cardSrc;
            newImg.id = `card_${cardID}`;
            newImg.alt = 'Main Draw Pile Card';
            newImg.className = 'draw';

            const drawPileContainer = document.querySelector('#drawPile');

            const existingImg = drawPileContainer.querySelector('img');
            if (existingImg) {
                drawPileContainer.removeChild(existingImg);
            }

            drawPileContainer.appendChild(newImg);
        } else {
            console.log('No data found for the main draw pile.');
        }
    } catch (error) {
        console.error('Failed to update the main draw pile:', error);
    }
}

async function displayOthersCards(login, password, gameID) {
    try {
        const cardsData = await fetchData('showOthersCards', [
            login,
            password,
            gameID,
        ]);
        const results = cardsData['RESULTS'][0];

        let playersCards = {};

        results.PlayerName.forEach((playerName, index) => {
            if (!playersCards[playerName]) {
                playersCards[playerName] = [];
            }
            playersCards[playerName].push({
                id: results.ID[index],
                cardValue: results.card_value[index],
                cardColor: results.card_color[index],
                gameId: results.game_id[index],
                src: `cards/${results.card_value[index]}.svg`,
                cardSource: results.CardSource[index],
            });
        });

        const otherCardsContainer =
            document.querySelector('#otherPlayersCards');
        otherCardsContainer.innerHTML = '';

        Object.entries(playersCards).forEach(([playerName, cards]) => {
            let playerDiv = document.createElement('div');
            playerDiv.className = 'otherPlayer';

            let playerNameHeader = document.createElement('h2');
            playerNameHeader.textContent = playerName;

            let cardsDiv = document.createElement('div');

            cards.forEach((card) => {
                let img = document.createElement('img');
                img.src = card.src;
                img.alt = `${card.cardColor} ${card.cardValue}`;
                img.className = card.cardSource.toLowerCase();
                img.id = `card_${card.id}`;

                cardsDiv.appendChild(img);
            });

            playerDiv.appendChild(playerNameHeader);
            playerDiv.appendChild(cardsDiv);
            otherCardsContainer.appendChild(playerDiv);
        });
    } catch (error) {
        console.error("Failed to display other players' cards:", error);
    }
}

function initGameField() {
    document.body.innerHTML = '';
    document.body.id = 'gameField';
    document.body.className = '';

    const newContent = `
        <header><button>Выйти</button></header>
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
                    <button id="finishButton">Закончить ход</button>
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

function beginGame(login, password, gameID) {
    initGameField();
    displayPlayerHand(login, password, gameID);
    displayPlayerDiscard(login, password, gameID);
    displayPlayerFirstStock(login, password, gameID);
    displayGamePiles(login, password, gameID);
    displayMainDrawPile(login, password, gameID);
    displayOthersCards(login, password, gameID);
}

async function exitGame(login, password, gameID) {
    const data = await fetchData('exitGame', [gameID, login, password]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        displayError(data['RESULTS'][0][firstKey]);
    } else {
        beginGame(login, password, gameID);
    }
}
