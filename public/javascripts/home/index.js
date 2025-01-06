import { logout, filterByID, filter_options, filters, filterByName, filterByType } from "../lib/lib1.js"

const dashboard_section = document.querySelector('.welcome');
const main_section = document.querySelector('.main-section');

const vendors_btn = document.querySelector('#vendors')
const users_btn = document.querySelector('#users')
const contracts_btn = document.querySelector('#contracts')

const add_contract = document.querySelector('#add-contract');
const add_vendor = document.querySelector('#add-vendor');
const add_user = document.querySelector('#add-user');

const filter = document.querySelector('#filter-select');
const filter_category = document.querySelector('#categories');
const filter_btn = document.querySelector('#filter-btn');
const search_input = document.querySelector('#search');
const clear_btn = document.querySelector('#clear-btn');
let userObj, vendorObj;

async function main() {
    logout();
    userObj = await getUsers()
    vendorObj = await getVendors()
    userObj = new Map(userObj.map(user => [user._id, user]));
    vendorObj = new Map(vendorObj.map(vendor => [vendor._id, vendor]));
    events();

    const categories = await getCategories();
    setCategories(categories)
    refresh();
}
main();

function refresh() {
    let hash = window.location.hash;
    if (hash) {
        const ele = document.querySelector(hash);
        ele.click();
    }
}


function events() {
    vendors_btn.addEventListener('click', () => {
        document.querySelector('.filter').classList.remove('hidden')
        main_section.classList.remove('hidden');
        dashboard_section.classList.add('hidden');
        populateVendors(vendorObj);
        add_vendor.classList.remove('hidden');
        add_contract.classList.add('hidden');
        add_user.classList.add('hidden');
        filter.replaceChildren(filters(filter_options.vendors));
        window.location.hash = 'vendors';
    })
    users_btn.addEventListener('click', () => {
        document.querySelector('.filter').classList.add('hidden')
        main_section.classList.remove('hidden');
        dashboard_section.classList.add('hidden');
        populateUsers(userObj);
        add_user.classList.remove('hidden');
        add_vendor.classList.add('hidden');
        add_contract.classList.add('hidden');

        filter.replaceChildren(filters(filter_options.users))
        window.location.hash = 'users';
    })
    contracts_btn.addEventListener('click', () => {
        document.querySelector('.filter').classList.add('hidden')
        main_section.classList.remove('hidden');
        dashboard_section.classList.add('hidden');
        add_contract.classList.remove('hidden')
        add_vendor.classList.add('hidden')
        add_user.classList.add('hidden')
        filter.replaceChildren(filters(filter_options.contracts));
        window.location.hash = 'contracts';
    })
    add_vendor.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register/vendor';
    })
    add_user.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register/user';
    })
    filter.addEventListener('change', (e) => {
        switch (e.target.value) {
            case '':
                filter_category.classList.add('hidden')
                filter_btn.classList.add('hidden');
                search_input.classList.add('hidden');
                break;
            case 'vendor-id':
                filter_category.classList.add('hidden');
                filter_btn.classList.remove('hidden');
                search_input.classList.remove('hidden');
                break;
            case 'vendor-type':
                filter_category.classList.remove('hidden');
                filter_btn.classList.remove('hidden');
                search_input.classList.add('hidden');
                break;
            case 'vendor-name':
                filter_category.classList.add('hidden');
                filter_btn.classList.remove('hidden');
                search_input.classList.remove('hidden');
                break;
            default:
                break;
        }
    })

    filter_btn.addEventListener('click', (e) => {
        e.preventDefault();
        let result;
        clear_btn.classList.remove('hidden');
        switch (filter.value) {
            case 'vendor-id':
                result = filterByID(search_input.value, vendorObj);
                result !== undefined ? populateVendors([result]) : alert('Invalid Search');
                break;
            case 'vendor-name':
                result = filterByName(search_input.value, vendorObj);
                result !== undefined ? populateVendors(result) : alert('Invalid Search');
                break;
            case 'vendor-type':
                result = filterByType(filter_category.value, vendorObj)
                result !== undefined ? populateVendors(result) : alert('Invalid Search');
                break;
            default:
                break;
        }

    })
    clear_btn.addEventListener('click', (e) => {
        e.preventDefault();
        populateVendors(vendorObj);
        clear_btn.classList.toggle('hidden');
        search_input.value = '';
        filter.value = '';
        filter_category.classList.add('hidden')
        filter_btn.classList.add('hidden');
        search_input.classList.add('hidden');
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
async function getCategories() {
    try {
        let response = await fetch('/db/categories')
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    } catch (err) {
        console.error(err);
    }
}

function populateUsers(user) {
    let userTable = fragmentation(['ID', 'Name', 'Email', 'Phone'], user)
    document.querySelector('#data-list__table').replaceChildren(userTable);
}
function populateVendors(vendor) {
    let vendorTable = fragmentation(['ID', 'Vendor Name', 'Vendor Type', 'Contact Person', 'Location'], vendor)
    document.querySelector('#data-list__table').replaceChildren(vendorTable);
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


// Search and Filter Code


function setCategories(cat) {
    cat.forEach(item => {
        const option = document.createElement('option');
        option.value = item.category;
        option.textContent = item.category;
        filter_category.appendChild(option)
    })
}

