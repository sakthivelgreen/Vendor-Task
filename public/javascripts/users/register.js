document.querySelector('#cancel').onclick = () => {
    window.history.back();
};

async function main(params) {
    register_user();
}
main();



async function validate_username() {
    try {
        let response = await fetch('/auth/username', {
            method: 'GET',
        })
        if (!response.ok) throw new Error(response.statusText);
        let result = await response.json();
        return result.users.includes(document.querySelector('#username').value);
    } catch (error) {
        console.error(error);
    }
}

async function register_user() {
    document.querySelector('#add-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });
        let res = await validate_username();
        if (res) {
            alert('username exist!')
            return;
        }
        try {
            let response = await fetch('/register/user', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonObject)
            })
            if (!response.ok) throw new Error(response.statusText);
            window.location.href = `/auth/login`;
        } catch (error) {
            console.error(error)
        }
    })
}