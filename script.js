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

handleFormSubmission('loginButton', 'auth', 'login', 'password');
handleFormSubmission('registerButton', 'register', 'reg-login', 'reg-password');
