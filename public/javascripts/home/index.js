import { logout } from "../lib/lib1.js"
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#vendor').addEventListener('click', () => window.open('/vendor/add', '_self'))
    logout();
})