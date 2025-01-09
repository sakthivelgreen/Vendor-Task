import { getUsers, getVendors, option_fragment, getCategories, getUserDetails } from "../lib/lib1.js";

document.querySelector('#cancel').addEventListener('click', (e) => window.history.back()) // Go Back 
const vendors_HTML = document.querySelector('#vendor');
const users_HTML = document.querySelector('#user');
const service_type_HTML = document.querySelector('#service-type');
let vendorsObj, usersObj, vendorMap, categoriesObj, current_user;

async function main() {
    vendorsObj = await getVendors();
    usersObj = await getUsers();
    current_user = await getUserDetails();
    categoriesObj = await getCategories();
    vendorMap = new Map(vendorsObj.map(item => [item._id, item]))
    processHTML();
    events()
} main() // Function call

function processHTML() {
    if (current_user.type == 'admin' || current_user.type == 'user') {
        service_type_HTML.appendChild(option_fragment(categoriesObj, 'category'))
    }
    if (current_user.type == 'admin' || current_user.type == 'vendor') {
        users_HTML.appendChild(option_fragment(usersObj, 'name'))
    }
}

function events() {
    if (current_user.type == 'admin' || current_user.type == 'user') {
        service_type_HTML.addEventListener('change', (e) => {
            let type = e.target.value;
            if (type == "") {
                vendors_HTML.innerHTML = `<option value=''>Choose Vendor</option>`;
            } else {
                let filtered_object = vendorsObj.filter(item => item.vendorType === type);
                if (filtered_object.length === 0) {
                    vendors_HTML.innerHTML = `<option value=''>Choose Vendor</option>`;
                } else {
                    vendors_HTML.replaceChildren(option_fragment(filtered_object, 'vendorName'))
                }
            }
        })
    }
    document.querySelector('#add-contract').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateDate()) {
            let formData = new FormData(e.target);
            let data = {
                'contractName': formData.get('contract-name'),
                'from': formData.get('from-date'),
                'to': formData.get('to-date'),
                'desc': formData.get('contract-description')
            }
            if (current_user.type === 'admin') {
                data.vendorID = vendors_HTML.selectedOptions[0].id;
                data.serviceType = formData.get('service-type');
                data.userID = users_HTML.selectedOptions[0].id;
            } else if (current_user.type == 'vendor') {
                data.vendorID = current_user.id;
                data.serviceType = vendorMap.get(current_user.id).vendorType; // get service type form vendors obj
                data.userID = users_HTML.selectedOptions[0].id;
            } else {
                data.vendorID = vendors_HTML.selectedOptions[0].id;
                data.serviceType = formData.get('service-type');
                data.userID = current_user.id;
            }
            try {
                let response = await fetch('/contract/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                if (!response.ok) throw new Error(response.statusText);
                window.location.href = '/#contracts';
            } catch (error) {
                console.error(error)
                throw new Error("Unable to Create Contract");

            }
        } else {
            alert(`Invalid Date's`);
        }
    })
}

function validateDate() {
    let from = new Date(document.querySelector('#from-date').value);
    let to = new Date(document.querySelector('#to-date').value);
    if (from.getTime() > to.getTime()) return false
    return true;
}