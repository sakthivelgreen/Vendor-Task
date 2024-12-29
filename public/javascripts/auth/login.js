document.addEventListener('DOMContentLoaded', () => {
    console.log('hi')
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        e.target.submit();
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