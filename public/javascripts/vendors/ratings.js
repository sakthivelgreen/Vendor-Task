import { getVendors, getContracts, option_fragment } from "../lib/lib1.js";

let vendors, contracts, user;
let contracts_html = document.querySelector('#contract')
let vendors_html = document.querySelector('#vendor')
async function main() {
    user = await getUserDetails();
    vendors = await getVendors();
    contracts = await getContracts();
    events();
    submitRatings();
} main() // Script Starts here

function events() {
    vendors_html.appendChild(option_fragment(vendors, 'vendorName'))
    vendors_html.addEventListener('change', (e) => {
        if (e.target.value != '') {
            let selected_vendor = e.target.selectedOptions[0].id;
            populateContract(selected_vendor);
        }
    })
    document.querySelector('#Cancel').addEventListener('click', () => window.history.back())
}

function populateContract(vendor_ID) {
    let filtered_contracts;
    if (user.type == 'admin') {
        filtered_contracts = contracts.filter(item => item.vendorID === vendor_ID);
    } else {
        filtered_contracts = contracts.filter(item => item.vendorID === vendor_ID && item.userID === user.id);
    }
    if (filtered_contracts.length > 0) {
        contracts_html.replaceChildren(option_fragment(filtered_contracts, 'contractName'))
    } else {
        contracts_html.innerHTML = `<option value=''>Choose..</option>`;
    }
}
async function submitRatings() {
    document.querySelector('#rating-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(document.querySelector('#rating-form'));
        let USER = user.type !== 'admin' ? user.id : 'admin';
        formData.append('user', USER)
        formData.append('_id', vendors_html.selectedOptions[0].id)
        formData.append('contractID', contracts_html.selectedOptions[0].id)
        formData.append('vendorID', vendors_html.selectedOptions[0].id)
        let average = getAverage([formData.get('quality'), formData.get('service'), formData.get('delivery'), formData.get('support'), formData.get('assist')])
        formData.append('overall', average)
        try {
            let response = await fetch('/vendor/ratings', {
                method: 'POST',
                body: formData
            })
            if (!response.ok) throw new Error(response.statusText);
            alert('Ratings Added');
            window.location.href = '/'
        } catch (error) {
            throw new Error(error)
        }
    })
}

async function getUserDetails() {
    try {
        let response = await fetch('/api/user-data');
        if (!response.ok) throw new Error(response.statusText);
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

function getAverage(arr) {
    let res = arr.reduce((acc, cur) => Number(acc) + Number(cur))
    return res / 5;
}