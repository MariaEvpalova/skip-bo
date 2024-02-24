async function registerUser(login, password) {
    const url = 'https://mysql.lavro.ru/call.php';
    const formData = new FormData();

    formData.append('pname', 'register');
    formData.append('db', '312279');
    formData.append('login', login);
    formData.append('password', password);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Registration successful:', jsonResponse);
        } else {
            console.error(
                'Registration failed:',
                response.status,
                response.statusText
            );
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}
