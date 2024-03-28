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
    else return data['RESULTS'][0]['first_player'][0] == login;
}

async function isCurrentPlayer(login, gameID) {
    const data = await fetchData('currentPlayer', [gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
    else return data['RESULTS'][0]['current_player'][0] == login;
}

async function gameWinner(gameID) {
    const data = await fetchData('gameWinner', [gameID]);
    const firstKey = Object.keys(data['RESULTS'][0]);
    if (firstKey === 'ERROR') console.log(data['RESULTS'][0][firstKey]);
    else return data['RESULTS'][0]['WINNER'][0];
}
