async function displayPlayerHand(login, password) {
    try {
        const handData = await fetchData('showPlayerHandCards', [
            login,
            password,
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

async function displayPlayerDiscard(login, password) {
    try {
        const discardData = await fetchData('showPlayerDiscardCards', [
            login,
            password,
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

async function displayPlayerFirstStock(login, password) {
    try {
        const firstStockData = await fetchData('showPlayerFirstStockCard', [
            login,
            password,
        ]);
        const firstCardData = firstStockData['RESULTS'][0];

        const firstCardValue = firstCardData.card_value[0];
        const firstCardSrc = `cards/${firstCardValue}.svg`;

        const stockCountData = await fetchData('countPlayerStockCards', [
            login,
            password,
        ]);
        const stockCount = stockCountData['RESULTS'][0].StockCardCount[0];

        const stockContainer = document.querySelector('#stock');
        stockContainer.innerHTML = `
                <img src="${firstCardSrc}" alt="" />
                <h2>${stockCount}</h2>
            `;
    } catch (error) {
        console.error('Failed to display first stock card and count:', error);
    }
}
function displayMainDraw() {}
function displayOthersCards() {}
