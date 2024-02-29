async function setupGamePage(playerName) {
    document.body.innerHTML = '';
    document.body.className = '';
    document.body.classList.add('games');

    const staticContent = `
        <header class="games">
            <h1>Имя Пользователя: ${playerName}</h1>
            <button id="logoutButton">Выйти</button>
        </header>
        <main class="games">
            <h1>Мои игры</h1>
            <div class="grid my-games"></div>
            <h1>Доступные игры</h1>
            <div class="grid available-games"></div>
        </main>
        <footer class="games">
            <button id="newGameButton">Новая игра</button>
        </footer>
        <div id="overlay"></div>
        <div id="newGameForm">
            <h2>Создать игру</h2>
            <label>Количество игроков: <input type="number" id="numPlayers"></label>
            <label>Продолжительность хода (сек): <input type="number" id="moveDuration"></label>
            <button id="createGameButton">Создать</button>
            <button id="closeFormButton" type="button">Закрыть</button>
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
            const login = 'exampleLogin';
            const password = 'examplePassword';

            try {
                const result = await fetchData('createGame', [
                    numPlayers,
                    moveDuration,
                    login,
                    password,
                ]);
                // Check result for success if necessary
                // If successful:
                window.location.reload();
            } catch (error) {
                console.error('Failed to create game:', error);
                // Handle the error (e.g., show an error message to the user)
            }
        });
    document
        .getElementById('closeFormButton')
        .addEventListener('click', function () {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('newGameForm').style.display = 'none';
        });

    try {
        let playerGamesData = await fetchData('displayPlayerGames', [
            playerName,
        ]);
        playerGamesData = playerGamesData['RESULTS'][0];

        let playerGameElements = ``;
        for (let i = 0; i < playerGamesData.ID.length; i++) {
            playerGameElements += `
                <div class="game">
                    <h2>Игра ${playerGamesData.ID[i]}</h2>
                    <ul>
                        <li>Макс. ${playerGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button>Присоединиться</button>
                </div>
            `;
        }

        let availableGamesData = await fetchData('displayAvailableGames', []);
        availableGamesData = availableGamesData['RESULTS'][0];

        let availableGameElements = ``;
        for (let i = 0; i < availableGamesData.ID.length; i++) {
            availableGameElements += `
                <div class="game">
                    <h2>Игра ${availableGamesData.ID[i]}</h2>
                    <ul>
                        <li>Админ ${availableGamesData.admin_login[i]}</li>
                        <li>${availableGamesData.current_players[i]} игрока</li>
                        <li>Макс. ${availableGamesData.num_players[i]} игрока</li>
                    </ul>
                    <button>Присоединиться</button>
                </div>
            `;
        }

        document.querySelector('.grid.my-games').innerHTML = playerGameElements;
        document.querySelector('.grid.available-games').innerHTML =
            availableGameElements;
    } catch (error) {
        console.error('Failed to fetch game data:', error);
    }
}
