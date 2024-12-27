document.addEventListener('DOMContentLoaded', () => {
    console.log('hi')
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        e.target.submit();
    })
})