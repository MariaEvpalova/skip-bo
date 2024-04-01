function logout(login, password) {
    fetchData('logout', [login, password]);
    start();
}

async function setupGamePage(login, password) {
    document.body.innerHTML = '';
    document.body.id = 'games';

    const staticContent = `
        <header>
            <h1>Пользователь ${login}</h1>
            <button id="logoutButton">Выйти</button>
        </header>
        <main>
            <h1>Созданные игры</h1>
            <div class="grid created-games"></div>
            <h1>Текущие игры</h1>
            <div class="grid current-games"></div>
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
                setupGamePage(login, password);
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
        const data = await fetchData('auth', [login, password]);
        const createdGamesData = data['RESULTS'][2];

        let createdGamesElements = ``;
        for (let i = 0; i < createdGamesData.ID.length; i++) {
            createdGamesElements += `
                <div class="game">
                    <h2>Игра ${createdGamesData.ID[i]}</h2>
                    <ul>
                        <li>Продолжительность хода ${createdGamesData.move_duration[i]}</li>
                        <li>${createdGamesData.current_players[i]} игрока</li>
                        <li>Макс. ${createdGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button onclick="enterGame('${login}', '${password}', ${createdGamesData.ID[i]})">Присоединиться</button>
                </div>
            `;
        }

        const currentGamesData = data['RESULTS'][4];

        let currentGamesElements = ``;
        for (let i = 0; i < currentGamesData.ID.length; i++) {
            currentGamesElements += `
                <div class="game">
                    <h2>Игра ${currentGamesData.ID[i]}</h2>
                    <ul>
                        <li>Продолжительность хода ${currentGamesData.move_duration[i]}</li>
                        <li>${currentGamesData.current_players[i]} игрока</li>
                        <li>Макс. ${currentGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button onclick="enterGame('${login}', '${password}', ${currentGamesData.ID[i]})">Присоединиться</button>
                </div>
            `;
        }

        const availableGamesData = data['RESULTS'][6];

        let availablesGamesElements = ``;
        for (let i = 0; i < availableGamesData.ID.length; i++) {
            availablesGamesElements += `
                <div class="game">
                    <h2>Игра ${availableGamesData.ID[i]}</h2>
                    <ul>
                        <li>Продолжительность хода ${availableGamesData.move_duration[i]}</li>
                        <li>${availableGamesData.current_players[i]} игрока</li>
                        <li>Макс. ${availableGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button onclick="enterGame('${login}', '${password}', ${availableGamesData.ID[i]})">Присоединиться</button>
                </div>
            `;
            //<li>Админ ${availableGamesData.admin_login[i]}</li>
        }

        document.querySelector('.grid.created-games').innerHTML =
            createdGamesElements;
        document.querySelector('.grid.current-games').innerHTML =
            currentGamesElements;
        document.querySelector('.grid.available-games').innerHTML =
            availablesGamesElements;

        document
            .getElementById('logoutButton')
            .addEventListener('click', () => logout(login, password));
    } catch (error) {
        console.error('Failed to fetch game data:', error);
    }
}

async function enterGame(login, password, gameID) {
    const data = await fetchData('enterGame', [gameID, login, password]);
    const firstKey = Object.keys(data['RESULTS'][0])[0];
    if (firstKey === 'ERROR') {
        console.log(data['RESULTS'][0][firstKey]);
    } else {
        enterGameFlow(login, password, gameID);
    }
}
