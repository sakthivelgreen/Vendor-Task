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

export async function getVendors() {
    try {
        let response = await fetch('/vendor/list')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
}
export async function getUsers() {
    try {
        let response = await fetch('/user/list')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
}
export async function getCategories() {
    try {
        let response = await fetch('/db/categories')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
}

export async function getContracts() {
    try {
        let response = await fetch('/contract/list')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
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

export function option_fragment(arr, key) {
    let fragment = document.createDocumentFragment();
    arr.forEach(item => {
        let option = document.createElement('option');
        option.value = item[key];
        option.id = item._id;
        option.textContent = item[key];
        fragment.appendChild(option);
    });
    return fragment;
}

export function refresh() { // Selecting the section based on url hash
    let hash = window.location.hash;
    if (hash) {
        const ele = document.querySelector(hash);
        ele.click();
    }
}

export function table_fragment(head, body) {
    const fragment = document.createDocumentFragment();
    const thead = document.createElement('thead');

    // Create table headers
    head.forEach(item => {
        const th = document.createElement('th');
        th.textContent = item;
        th.className = item;
        thead.appendChild(th);
    });
    fragment.appendChild(thead);
    const tbody = document.createElement('tbody');

    // Process each row in the 
    if (body.size > 0) {
        body.forEach(row_data => {
            const normalizedRowData = normalizeKeysToLowerCase(row_data); // Normalize keys
            const tr = document.createElement('tr');

            head.forEach(header => {
                const td = document.createElement('td');
                const key = trimAndLowerCase(header); // Convert header to match normalized keys
                if (key == 'id') {
                    td.textContent = row_data['_id'];
                } else {
                    td.textContent = (normalizedRowData[key] !== undefined && normalizedRowData[key] !== '') ? normalizedRowData[key] : '-';
                }
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'No items to display';
        td.colSpan = head.length;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    fragment.appendChild(tbody);
    return fragment;
}

export function trimAndLowerCase(item) {
    if (typeof item !== 'string') {
        console.warn('Expected a string, but received:', item);
        return ''; // Return an empty string or a fallback value
    }

    // Remove extra spaces from start and end
    item = item.trim();
    // Replace multiple spaces between words with a single space
    item = item.replace(/\s+/g, '');
    return item.toLowerCase();
}

export function normalizeKeysToLowerCase(obj) { // converting keys to lower case for matching the table heading
    const normalizedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            normalizedObj[key.toLowerCase()] = obj[key];
        }
    }
    return normalizedObj;
}

export async function getUserDetails() {
    try {
        let response = await fetch('/api/user-data');
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}