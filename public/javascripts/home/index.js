import { logout, filterByID, filter_options, filters, filterByName, filterByType, getCategories, getUsers, getContracts, getVendors, option_fragment } from "../lib/lib1.js"

const dashboard_section = document.querySelector('.welcome');
const main_section = document.querySelector('.main-section');
const overlap_contract_section = document.querySelector('.overlap-contract-section');

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
let userObj, vendorObj, ContractObj, ContractMap, vendorMap, userMap;

async function main() {
    logout();
    userObj = await getUsers()
    vendorObj = await getVendors()
    ContractObj = await getContracts()
    userMap = new Map(userObj.map(user => [user._id, user]));
    vendorMap = new Map(vendorObj.map(vendor => [vendor._id, vendor]));
    ContractMap = new Map(ContractObj.map(contract => [contract._id, contract]));
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
        overlap_contract_section.classList.add('hidden');

        populateVendors(vendorMap);

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
        overlap_contract_section.classList.add('hidden');

        populateUsers(userMap);

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
        add_contract.classList.remove('hidden');
        overlap_contract_section.classList.remove('hidden');
        document.querySelector('#vendor-filter').appendChild(option_fragment(vendorObj, 'vendorName'));
        document.querySelector('#user-filter').appendChild(option_fragment(userObj, 'name'));

        populateContracts(ContractMap);
        add_vendor.classList.add('hidden');
        add_user.classList.add('hidden');

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
    add_contract.addEventListener('click', () => { window.location.href = '/contract/add' })
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
                result = filterByID(search_input.value, vendorMap);
                result !== undefined ? populateVendors([result]) : alert('Invalid Search');
                break;
            case 'vendor-name':
                result = filterByName(search_input.value, vendorMap);
                result !== undefined ? populateVendors(result) : alert('Invalid Search');
                break;
            case 'vendor-type':
                result = filterByType(filter_category.value, vendorMap)
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
    document.querySelector('#overlap-user__form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelector('#clear-overlap').classList.remove('hidden')
        let selected_user_id = document.querySelector('#user-filter').selectedOptions[0].id;
        let selected_vendor_id = document.querySelector('#vendor-filter').selectedOptions[0].id;
        let contracts = ContractObj.filter(item => item.userID === selected_user_id && item.vendorID === selected_vendor_id)
        contracts.sort((a, b) => new Date(a.from) - new Date(b.from));
        let overlapping_contracts = new Set();
        let filtered_contracts = []
        for (let i = 0; i < contracts.length; i++) {
            for (let j = i + 1; j < contracts.length; j++) {
                if (isOverlapping(contracts[i], contracts[j])) {
                    overlapping_contracts.add(contracts[i]._id)
                    overlapping_contracts.add(contracts[j]._id)
                }
            }
        }
        overlapping_contracts.forEach(item => {
            filtered_contracts.push(ContractMap.get(item))
        })

        if (filtered_contracts.length > 0) {
            populateOverlaps(filtered_contracts)
        } else {
            populateOverlaps([])
        }

        function isOverlapping(contract1, contract2) {
            return (
                new Date(contract1.from) <= new Date(contract2.to) && // Condition 1
                new Date(contract1.to) >= new Date(contract2.from)   // Condition 2
            );
        }

    })
    document.querySelector('#clear-overlap').addEventListener('click', (e) => {
        e.preventDefault();
        e.target.classList.add('hidden');
        document.querySelector('#contract-overlap__table').innerHTML = '';
        document.querySelector('#user-filter').value = ''
        document.querySelector('#vendor-filter').value = ''
    })
}

function populateUsers(user) {
    let userTable = fragmentation(['ID', 'Name', 'Email', 'Phone'], user)
    document.querySelector('#data-list__table').replaceChildren(userTable);
}
function populateVendors(vendor) {
    let vendorTable = fragmentation(['ID', 'Vendor Name', 'Vendor Type', 'Contact Person', 'Location'], vendor)
    document.querySelector('#data-list__table').replaceChildren(vendorTable);
}
function populateContracts(contracts) {
    let vendorTable = fragmentation(['ID', 'Contract Name', 'Vendor ID', 'Service Type', 'User ID', 'From', 'To'], contracts)
    document.querySelector('#data-list__table').replaceChildren(vendorTable);
}
function populateOverlaps(contracts) {
    contracts = new Map(contracts.map(item => [item._id, item]))
    let overlapTable = fragmentation(['ID', 'Contract Name', 'User ID', 'From', 'To'], contracts);
    document.querySelector('#contract-overlap__table').replaceChildren(overlapTable);
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

