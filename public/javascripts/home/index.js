import { logout } from "../lib/lib1.js"

const vendors_btn = document.querySelector('#vendor')
const users_btn = document.querySelector('#user')
const contracts_btn = document.querySelector('#contract')
const vendor_Section = document.querySelector('.vendors-section')
const user_Section = document.querySelector('.users-section')
const contract_Section = document.querySelector('.contracts-section')


async function main() {
    logout();
    events();
    const userObj = await getUsers()
    const vendorObj = await getVendors()
    populateTables(userObj, vendorObj)
}
main();

function events() {
    vendors_btn.addEventListener('click', () => {
        vendor_Section.classList.remove('hidden');
        user_Section.classList.add('hidden')
        contract_Section.classList.add('hidden');
    })
    users_btn.addEventListener('click', () => {
        vendor_Section.classList.add('hidden');
        user_Section.classList.remove('hidden')
        contract_Section.classList.add('hidden');
    })
    contracts_btn.addEventListener('click', () => {
        vendor_Section.classList.add('hidden');
        user_Section.classList.add('hidden')
        contract_Section.classList.remove('hidden');
    })
    document.querySelector('#add-vendor').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register/vendor';
    })
    document.querySelector('#add-user').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register/user';
    })
}

async function getVendors() {
    try {
        let response = await fetch('/vendor/list')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
}
async function getUsers() {
    try {
        let response = await fetch('/user/list')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
}

function populateTables(user, vendor) {

    let vendorTable = fragmentation(['ID', 'Vendor Name', 'Type', 'Services', 'Contact Person', 'Contact Mobile', 'Location', 'Capacity'], vendor)
    document.querySelector('#vendors-list__table').appendChild(vendorTable);

    let userTable = fragmentation(['ID', 'Name', 'Email', 'Phone'], user)
    document.querySelector('#users-list__table').appendChild(userTable);
}

function fragmentation(head, body) {
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

    // Process each row in the body
    body.forEach(row_data => {
        const normalizedRowData = normalizeKeysToLowerCase(row_data); // Normalize keys
        const tr = document.createElement('tr');

        head.forEach(header => {
            const td = document.createElement('td');
            const key = trimAndLowerCase(header); // Convert header to match normalized keys
            td.textContent = normalizedRowData[key] !== undefined ? normalizedRowData[key] : '-';
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    fragment.appendChild(tbody);
    return fragment;
}


function trimAndLowerCase(item) {
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

function normalizeKeysToLowerCase(obj) {
    const normalizedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            normalizedObj[key.toLowerCase()] = obj[key];
        }
    }
    return normalizedObj;
}
