const express = require('express');
const router = express.Router();
router.get('/add', (req, res) => {
    res.render('vendors/add_vendor', { title: 'Add Vendors' })
});
router.post('/add', (req, res) => {
    console.log(req.body);
    const data = req.body;
    console.log(data)
    return;
    // res.send('added!')
})
module.exports = router;