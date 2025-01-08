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
    logout(); // logout functionality for user, vendor, admin logout;
    userObj = await getUsers() // getting users list
    vendorObj = await getVendors() // getting vendors list
    ContractObj = await getContracts() // getting contracts list

    // creating Hash Map for faster accessing of data;
    userMap = new Map(userObj.map(user => [user._id, user]));
    vendorMap = new Map(vendorObj.map(vendor => [vendor._id, vendor]));
    ContractMap = new Map(ContractObj.map(contract => [contract._id, contract]));

    events(); // Calling events function to add Events to the html elements

    const categories = await getCategories(); // getting the list of categories
    setCategories(categories) // inserting categories to select HTML for vendor filtering
    refresh(); // if page reloaded redirect to section based on hash in url
}
main(); // main function Script Executes from here !!!!!!!!!!

function refresh() { // Selecting the section based on url hash
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
        add_vendor.classList.remove('hidden');
        add_contract.classList.add('hidden');
        add_user.classList.add('hidden');

        populateVendors(vendorMap); // dynamically creating vendor table
        // inserting filter options for vendor filtering
        filter.replaceChildren(filters(filter_options.vendors));
        // adding hash to the url for reload and refresh fix!;
        window.location.hash = 'vendors';
    })
    users_btn.addEventListener('click', () => {
        document.querySelector('.filter').classList.add('hidden')
        main_section.classList.remove('hidden');
        dashboard_section.classList.add('hidden');
        overlap_contract_section.classList.add('hidden');
        add_user.classList.remove('hidden');
        add_vendor.classList.add('hidden');
        add_contract.classList.add('hidden');

        populateUsers(userMap); // dynamically creating users table 
        // inserting data for HTML select element for user filtering
        filter.replaceChildren(filters(filter_options.users))
        window.location.hash = 'users';// add hash to the url for reload and refresh fix!;
    })

    // Contract Section - aside section Contracts btn Event
    contracts_btn.addEventListener('click', () => {
        document.querySelector('.filter').classList.add('hidden')
        main_section.classList.remove('hidden');
        dashboard_section.classList.add('hidden');
        add_contract.classList.remove('hidden');
        overlap_contract_section.classList.remove('hidden');
        add_vendor.classList.add('hidden');
        add_user.classList.add('hidden');

        populateContracts(ContractMap); // calling function to dynamically populate table

        // inserting data to the HTML Select option for filtering contracts
        filter.replaceChildren(filters(filter_options.contracts)); // currently disabled
        window.location.hash = 'contracts'; // adding hash to the url for reload and refresh fix!
    })

    // redirect to add new vendor page
    add_vendor.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register/vendor';
    })

    // redirect to add new user page
    add_user.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/register/user';
    })

    // redirect to add new contract page
    add_contract.addEventListener('click', () => { window.location.href = '/contract/add' })

    filter.addEventListener('change', (e) => { // vendor filter Event
        switch (e.target.value) {
            case '': // if no filter is selected
                filter_category.classList.add('hidden')
                filter_btn.classList.add('hidden');
                search_input.classList.add('hidden');
                break;
            case 'vendor-id': // enable options for filter using vendor id
                filter_category.classList.add('hidden');
                filter_btn.classList.remove('hidden');
                search_input.classList.remove('hidden');
                break;
            case 'vendor-type': // enable options for filter using vendor type
                filter_category.classList.remove('hidden');
                filter_btn.classList.remove('hidden');
                search_input.classList.add('hidden');
                break;
            case 'vendor-name': // enable options for filter using vendor name
                filter_category.classList.add('hidden');
                filter_btn.classList.remove('hidden');
                search_input.classList.remove('hidden');
                break;
            default:
                break;
        }
    })

    filter_btn.addEventListener('click', (e) => { // event to apply filter by clicking filter btn;
        e.preventDefault();
        let result;
        clear_btn.classList.remove('hidden');
        switch (filter.value) {
            case 'vendor-id':
                result = filterByID(search_input.value, vendorMap); // retrieving data using ID
                result !== undefined ? populateVendors([result]) : alert('Invalid Search');
                break;
            case 'vendor-name':
                result = filterByName(search_input.value, vendorMap); // retrieving data using Name
                result !== undefined ? populateVendors(result) : alert('Invalid Search');
                break;
            case 'vendor-type':
                result = filterByType(filter_category.value, vendorMap) // retrieving data using Type
                result !== undefined ? populateVendors(result) : alert('Invalid Search');
                break;
            default:
                break;
        }

    })

    // for clearing vendor filters
    clear_btn.addEventListener('click', (e) => {
        e.preventDefault();
        populateVendors(vendorObj); // resets the table to default list
        clear_btn.classList.toggle('hidden');
        search_input.value = '';
        filter.value = '';
        filter_category.classList.add('hidden')
        filter_btn.classList.add('hidden');
        search_input.classList.add('hidden');
    })

    // inserting vendor and user names to select-HTML for contract filtering
    document.querySelector('#vendor-filter').appendChild(option_fragment(vendorObj, 'vendorName'));
    document.querySelector('#user-filter').appendChild(option_fragment(userObj, 'name'));

    // contract filter form submit Event
    document.querySelector('#overlap-user__form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelector('#clear-overlap').classList.remove('hidden');
        let selected_user_id = document.querySelector('#user-filter').selectedOptions[0].id; // Getting User ID
        let selected_vendor_id = document.querySelector('#vendor-filter').selectedOptions[0].id;// Getting Vendor ID
        // filtering contract based on user id & vendor id
        let contracts = ContractObj.filter(item => item.userID === selected_user_id && item.vendorID === selected_vendor_id)
        contracts.sort((a, b) => new Date(a.from) - new Date(b.from)); // sorting contract based on date
        let overlapping_contracts = new Set(); // to avoid duplicate using set;
        let filtered_contracts = [] // for storing unique overlapped contracts;
        for (let i = 0; i < contracts.length; i++) {
            for (let j = i + 1; j < contracts.length; j++) {
                if (isOverlapping(contracts[i], contracts[j])) {
                    overlapping_contracts.add(contracts[i]._id);
                    overlapping_contracts.add(contracts[j]._id);
                }
            }
        }
        overlapping_contracts.forEach(item => {
            filtered_contracts.push(ContractMap.get(item)); // Storing the contract in array
        })

        if (filtered_contracts.length > 0) {
            populateOverlaps(filtered_contracts)  // if contract overlapping displays in table 
        } else {
            populateOverlaps([]) // if there is no overlapping displays empty table
        }

        // to check overlapping date
        function isOverlapping(contract1, contract2) {
            return (
                new Date(contract1.from) <= new Date(contract2.to) && // Condition 1
                new Date(contract1.to) >= new Date(contract2.from)   // Condition 2
            );
        }

    })

    // for Clearing contract filter table 
    document.querySelector('#clear-overlap').addEventListener('click', (e) => {
        e.preventDefault();
        e.target.classList.add('hidden');
        document.querySelector('#contract-overlap__table').innerHTML = '';
        document.querySelector('#user-filter').value = ''
        document.querySelector('#vendor-filter').value = ''
    })

    document.querySelector('#ratings').addEventListener('click', () => { window.location.href = `/vendor/ratings` })

}

// for user table 
function populateUsers(user) {
    let userTable = fragmentation(['ID', 'Name', 'Email', 'Phone'], user)
    document.querySelector('#data-list__table').replaceChildren(userTable);
}

// for vendor table
function populateVendors(vendor) {
    let vendorTable = fragmentation(['ID', 'Vendor Name', 'Vendor Type', 'Contact Person', 'Location'], vendor)
    document.querySelector('#data-list__table').replaceChildren(vendorTable);
}

// for contracts table
function populateContracts(contracts) {
    let vendorTable = fragmentation(['ID', 'Contract Name', 'Vendor ID', 'Service Type', 'User ID', 'From', 'To'], contracts)
    document.querySelector('#data-list__table').replaceChildren(vendorTable);
}

// for overlapping contracts table
function populateOverlaps(contracts) {
    contracts = new Map(contracts.map(item => [item._id, item]))
    let overlapTable = fragmentation(['ID', 'Contract Name', 'User ID', 'From', 'To'], contracts);
    document.querySelector('#contract-overlap__table').replaceChildren(overlapTable);
}

// dynamic table creation using fragmentation
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

function normalizeKeysToLowerCase(obj) { // converting keys to lower case for matching the table heading
    const normalizedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            normalizedObj[key.toLowerCase()] = obj[key];
        }
    }
    return normalizedObj;
}


// Search and Filter Code

function setCategories(cat) { // setting categories for vendor filtering
    cat.forEach(item => {
        const option = document.createElement('option');
        option.value = item.category;
        option.textContent = item.category;
        filter_category.appendChild(option)
    })
}

