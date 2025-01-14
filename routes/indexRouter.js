const express = require('express');
const router = express.Router();
function checkLogin(req, res) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
}
router.get('/', (req, res) => {
    checkLogin(req, res)
    if (!req.session.user) return;
    if (req.session.user.type === 'admin') {
        res.render('index', { title: `${req.session.user.name} - Vendor Management System`, data: req.session.user });
    } else {
        res.redirect(`${req.session.user.type}/dashboard`);
    }
});

module.exports = router;