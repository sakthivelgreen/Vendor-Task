var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const vendorRouter = require('./routes/vendorRoutes');
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
const corsOptions = {
    origin: 'self',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type',
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; style-src-elem 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.use('/vendor', vendorRouter);


app.get('/', (req, res) => {
    res.render('index', { title: 'Vendor Management System - Homepage' });
});
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
})
module.exports = app;
