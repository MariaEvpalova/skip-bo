function logout(login, password, token) {
    fetchData('logout', [login, password, token]);
    startGame();
}

async function setupGamePage(login, password, token) {
    document.body.innerHTML = '';
    document.body.id = 'games';

    const staticContent = `
        <header>
            <h1>Пользователь ${login}</h1>
            <button id="logoutButton">Выйти</button>
        </header>
        <main>
            <h1>Мои игры</h1>
            <div class="grid my-games"></div>
            <h1>Доступные игры</h1>
            <div class="grid available-games"></div>
        </main>
        <footer>
            <button id="newGameButton">Новая игра</button>
        </footer>
        <div id="overlay"></div>
        <div id="newGameForm">
            <div>
                <h2>Создать игру</h2>
                <div><label>Количество игроков:</label></div>
                <div><input type="number" id="numPlayers" /></div>
                <div><label>Продолжительность хода (сек):</label></div>
                <div><input type="number" id="moveDuration" /></div>
            </div>
            <div>
                <button id="createGameButton">Создать</button>
                <button id="closeFormButton" type="button">Закрыть</button>
            </div>
        </div>
    `;

    document.body.innerHTML = staticContent;

    document
        .getElementById('newGameButton')
        .addEventListener('click', function () {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('newGameForm').style.display = 'block';
        });

    document
        .getElementById('createGameButton')
        .addEventListener('click', async function () {
            const numPlayers = document.getElementById('numPlayers').value;
            const moveDuration = document.getElementById('moveDuration').value;

            try {
                const result = await fetchData('createGame', [
                    numPlayers,
                    moveDuration,
                    login,
                    password,
                ]);
                setupGamePage(login, password, token);
            } catch (error) {
                console.error('Failed to create game:', error);
            }
        });
    document
        .getElementById('closeFormButton')
        .addEventListener('click', function () {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('newGameForm').style.display = 'none';
        });

    try {
        let playerGamesData = await fetchData('displayUserGames', [login]);
        playerGamesData = playerGamesData['RESULTS'][0];

        let playerGameElements = ``;
        for (let i = 0; i < playerGamesData.ID.length; i++) {
            playerGameElements += `
                <div class="game">
                    <h2>Игра ${playerGamesData.ID[i]}</h2>
                    <ul>
                    <li>Продолжительность хода ${playerGamesData.move_duration[i]}</li>
                    <li>${playerGamesData.current_players[i]} игрока</li>
                        <li>Макс. ${playerGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button onclick="enterGame('${login}', '${password}', ${playerGamesData.ID[i]})">Присоединиться</button>
                </div>
            `;
        }

        let availableGamesData = await fetchData('displayOtherGames', [login]);
        availableGamesData = availableGamesData['RESULTS'][0];

        let availableGameElements = ``;
        for (let i = 0; i < availableGamesData.ID.length; i++) {
            availableGameElements += `
                <div class="game">
                    <h2>Игра ${availableGamesData.ID[i]}</h2>
                    <ul>
                        <li>Админ ${availableGamesData.admin_login[i]}</li>
                        <li>Продолжительность хода ${availableGamesData.move_duration[i]}</li>
                        <li>${availableGamesData.current_players[i]} игрока</li>
                        <li>Макс. ${availableGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button onclick="enterGame('${login}', '${password}', ${availableGamesData.ID[i]})">Присоединиться</button>
                </div>
            `;
        }

        document.querySelector('.grid.my-games').innerHTML = playerGameElements;
        document.querySelector('.grid.available-games').innerHTML =
            availableGameElements;

        document
            .getElementById('logoutButton')
            .addEventListener('click', () => logout(login, password, token));
    } catch (error) {
        console.error('Failed to fetch game data:', error);
    }
}

async function enterGame(login, password, gameID) {
    const data = await fetchData('enterGame', [gameID, login, password]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        displayError(data['RESULTS'][0][firstKey]);
    } else {
        beginGame(login, password, gameID);
    }
}
