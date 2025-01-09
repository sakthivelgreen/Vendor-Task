import { logout, table_fragment, getContracts, getVendors, getUserDetails, refresh } from '../lib/lib1.js'

const contracts_btn = document.querySelector('#contracts');
let vendor, contracts, ContractMap, current_user;

async function main() {
    vendor = await getVendors();
    contracts = await getContracts();
    current_user = await getUserDetails();
    vendor = vendor.filter(item => item._id === current_user.id);
    contracts = contracts.filter(item => item.vendorID == current_user.id)
    ContractMap = new Map(contracts.map(contract => [contract._id, contract]));
    logout();
    events();
    refresh();
} main() // Script Starts here

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
}

function populateContracts(contracts) {
    let contractTable = table_fragment(['ID', 'Contract Name', 'Vendor ID', 'Service Type', 'User ID', 'From', 'To'], contracts)
    document.querySelector('#data-list__table').replaceChildren(contractTable);
}