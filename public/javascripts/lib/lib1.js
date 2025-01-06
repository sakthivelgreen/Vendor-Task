export function logout() {
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
}
export const filter_options = {
    'vendors': {
        'Select Option': '',
        'Vendor Name': 'vendor-name',
        'Vendor ID': 'vendor-id',
        'Vendor Type': 'vendor-type'
    },
    'users': {
        'Select Option': '',
        'Name': 'user-name',
        'User ID': 'user-id',
        'Email': 'user-email'
    },
    'contracts': {
        'Select Option': '',
        'Contract Name': 'contract-name',
        'Contract ID': 'contract-id',
    }
}
export function filters(filter) {
    const fragment = document.createDocumentFragment();
    for (const key in filter) {
        const option = document.createElement('option');
        option.value = filter[key];
        option.textContent = key;
        fragment.appendChild(option);
    }
    return fragment;
}
export function filterByID(search_key, obj) {
    if (search_key !== '') {
        const result = obj.get(search_key);
        return result;
    }
}
export function filterByName(search_key, obj) {
    if (search_key !== '') {
        const result = Array.from(obj).filter(item => item[1].vendorName.toLowerCase().includes(search_key.toLowerCase()));
        return new Map(result);
    }
}
export function filterByType(search_key, obj) {
    if (search_key !== '') {
        const result = Array.from(obj).filter(item => item[1].vendorType.trim().toLowerCase() === search_key.trim().toLowerCase());
        return new Map(result)
    }
}