document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.querySelector('#username')
        const password = document.querySelector('#password')
        const type = document.querySelector('#user-type');
        await login(username, password, type)
    })
    document.getElementById('register_account').addEventListener('click', (e) => {
        e.preventDefault();
        let type = document.querySelector('#type').value;
        switch (type) {
            case 'vendor':
                window.location.href = '/register/vendor'
                break;

            case 'user':
                window.location.href = '/register/user'
                break;

            default:
                break;
        }
    })
})

async function login(user, pass, type) {
    try {
        let response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': user.value,
                'password': pass.value,
                'user_type': type.value
            })
        })
        if (!response.ok) {
            const error = await response.json(); // Expect JSON response with error message
            throw new Error(error.error || 'Unknown error occurred');
        }
        window.location.href = '/'
    } catch (err) {
        alert(err)
    }
}