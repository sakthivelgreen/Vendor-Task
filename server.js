var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'self',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type',
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', async (req, res) => {
    res.send('working!')
})
app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
})
module.exports = app;
