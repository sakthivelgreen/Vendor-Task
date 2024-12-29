document.addEventListener('DOMContentLoaded', () => {
    console.log('hi')
    async function main(params) {
        let data = await getData_db();
        console.log(data);
        processData(data);
    }
    main();

})

async function getData_db() {
    try {
        let cat = await fetch('/db/categories');
        let pdt = await fetch('/db/products');
        let res = {
            categories: await cat.json(),
            products: await pdt.json()
        }
        if (!cat.ok || !pdt.ok) throw new Error({ cat: cat.status, pdt: pdt.status });
        return res;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}
function processData(data) {
    document.querySelector('#vendor-type').appendChild(fragment(data.categories, 'category'));
    document.querySelector('#vendor-type').addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedId = selectedOption.id;
        if (document.querySelector('#vendor-type').value !== '') {
            let filteredProducts = data.products.filter(item => item.category === selectedId)
            filteredProducts.length > 0
                ? document.querySelector('#services').replaceChildren(fragment(filteredProducts, 'product'))
                : resetServices();
        } else {
            resetServices();
        }
    })
}
function fragment(arr, key) {
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
function resetServices() {
    let option = document.createElement('option');
    option.disabled = true;
    option.textContent = 'Select Services';
    option.selected = true
    document.querySelector('#services').replaceChildren(option);
}