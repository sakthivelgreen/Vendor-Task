const express = require('express');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
    res.render('users/dashboard', ({ title: `${req.session.user.name} - Dashboard`, data: req.session.user }))
});

module.exports = router;