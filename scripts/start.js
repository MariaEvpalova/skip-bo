async function fetchData(pname, params) {
    let url = `https://sql.lavro.ru/call.php?pname=${pname}&db=312279`;

    params.forEach((param, index) => {
        url += `&p${index + 1}=${param}`;
    });

    url += '&format=columns';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            'There has been a problem with your fetch operation:',
            error
        );
        throw error;
    }
}

async function handleFormSubmission(buttonId, pname, loginId, passwordId) {
    document
        .getElementById(buttonId)
        .addEventListener('click', async function (e) {
            e.preventDefault();
            const login = document.getElementById(loginId).value;
            const password = document.getElementById(passwordId).value;
            try {
                const data = await fetchData(pname, [login, password]);
                const firstKey = Object.keys(data['RESULTS'][0])[0];
                if (firstKey === 'ERROR') {
                    displayError(data['RESULTS'][0][firstKey]);
                } else {
                    setupGamePage(login, password);
                }
            } catch (error) {
                console.error(`${pname} failed`, error);
                displayError(error.message);
            }
        });
}

function displayError(errorMessage) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = errorMessage;
}

function displayStartPage() {
    document.body.innerHTML = '';
    document.body.id = 'rules';

    const startPageContent = `
        <header>
            <h1>Skip-Bo</h1>
        </header>

        <main>
            <div>
                <h2>Вход</h2>
                <form id="loginForm">
                    <div>
                        <label for="login">Логин:</label>
                        <input type="text" id="login" name="login" />
                    </div>
                    <div>
                        <label for="password">Пароль:</label>
                        <input type="password" id="password" name="password" />
                    </div>
                    <div>
                        <button type="button" id="loginButton">Вход</button>
                    </div>
                </form>

                <h2>Регистрация</h2>
                <form id="registrationForm">
                    <div>
                        <label for="reg-login">Логин:</label>
                        <input type="text" id="reg-login" name="login" />
                    </div>
                    <div>
                        <label for="reg-password">Пароль:</label>
                        <input
                            type="password"
                            id="reg-password"
                            name="password" />
                    </div>
                    <div>
                        <button type="button" id="registerButton">
                            Регистрация
                        </button>
                    </div>
                </form>
                <p id="error-message"></p>
            </div>

            <div>
                <h2>Описание игры</h2>
                <p>
                    Skip-Bo — это карточная игра, основанная на стратегии и
                    удаче, цель которой — первым избавиться от всех карт в своей
                    стопке. Вот краткие правила:
                </p>
                <ol>
                    <li>
                        <strong>Цель игры</strong> Первым избавиться от всех
                        карт в своей личной стопке.
                    </li>
                    <li>
                        <strong>Подготовка к игре </strong>Каждому игроку
                        раздается стопка из 30 карт (для более короткой игры
                        можно использовать 20 карт). Верхняя карта стопки
                        открывается. Оставшиеся карты кладутся в центр в
                        качестве колоды для добора.
                    </li>
                    <li>
                        <strong>Игровой процесс</strong> Игроки по очереди
                        делают ходы, стремясь выложить карты от 1 до 12 в четыре
                        стопки построения в центре стола. Skip-Bo карты являются
                        джокерами и могут заменять любую карту.
                    </li>
                    <li>
                        <strong>Как играть</strong> В свой ход игрок добирает
                        карты, чтобы в руке было пять карт. Игрок может играть
                        карты из руки, своей личной стопки или из стопок сброса,
                        стремясь выложить их в стопки построения по возрастанию.
                    </li>
                    <li>
                        <strong>Стопки сброса</strong> Каждый игрок может иметь
                        до четырех стопок сброса, куда можно сбрасывать карты из
                        руки в конце хода.
                    </li>
                    <li>
                        <strong>Завершение хода</strong> Если игрок не может или
                        не хочет больше играть карты, он сбрасывает одну карту в
                        стопку сброса, и ход переходит к следующему игроку.
                    </li>
                    <li>
                        <strong>Как выиграть</strong> Игра продолжается до тех
                        пор, пока один из игроков не избавится от всех карт в
                        своей личной стопке, тем самым выигрывая игру.
                    </li>
                </ol>
            </div>
        </main>
        `;

    document.body.innerHTML = startPageContent;
}

function start() {
    displayStartPage();
    handleFormSubmission('loginButton', 'auth', 'login', 'password');
    handleFormSubmission(
        'registerButton',
        'register',
        'reg-login',
        'reg-password'
    );
}

start();
