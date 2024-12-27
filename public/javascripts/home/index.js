document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#vendor').addEventListener('click', () => window.open('/vendor/add', '_self'))
    document.querySelector('#logout').addEventListener('click', (e) => {
        e.preventDefault();
        fetch('/auth/logout', { method: 'GET' })
            .then(response => {
                if (response.ok) {
                    // Redirect the user to the login page after a successful logout
                    window.location.href = '/auth/login';
                } else {
                    console.error('Failed to log out');
                    alert('Error logging out. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error logging out. Please try again.');
            });
    });

})