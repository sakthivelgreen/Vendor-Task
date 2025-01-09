import { logout, table_fragment, getContracts, getVendors, getUserDetails, refresh, getUsers } from '../lib/lib1.js'

let user, vendors, contracts, ContractMap, current_user;
const contracts_btn = document.querySelector('#contracts');

async function main() {
    user = await getUsers();
    current_user = await getUserDetails();
    user = user.reduce((acc, item) => {
        return acc || (item._id === current_user.id ? item : null);
    }, null);
    vendors = await getVendors();
    contracts = await getContracts();
    contracts = contracts.filter(item => item.userID == current_user.id)
    ContractMap = new Map(contracts.map(item => [item._id, item]))
    events();
    logout();
    populateDetails();
    refresh();
} main();

function populateDetails() {
    document.querySelector('#name-span-td').textContent = user.name;
    document.querySelector('#userID-span-td').textContent = user._id;
    document.querySelector('#email-span-td').textContent = user.email;
    document.querySelector('#phone-span-td').textContent = user.phone;
}
function events() {
    contracts_btn.addEventListener('click', () => {
        document.querySelector('#contracts-section').classList.remove('hidden');
        document.querySelector('#home-section').classList.add('hidden');

        populateContracts(ContractMap); // calling function to dynamically populate table
        window.location.hash = 'contracts'; // adding hash to the url for reload and refresh fix!
    })
    document.querySelector('#home').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#contracts-section').classList.add('hidden');
        document.querySelector('#home-section').classList.remove('hidden');
        window.location.hash = 'home';
    })
    document.querySelector('#add-contract').addEventListener('click', () => window.location.href = '/contract/add')
    document.querySelector('#vendor-ratings').addEventListener('click', () => window.location.href = '/vendor/ratings')
}

function populateContracts(contracts) {
    let contractTable = table_fragment(['ID', 'Contract Name', 'Vendor ID', 'Service Type', 'User ID', 'From', 'To'], ContractMap)
    document.querySelector('#data-list__table').replaceChildren(contractTable);
}