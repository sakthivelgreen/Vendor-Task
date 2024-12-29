require('dotenv').config();
var express = require('express');
var path = require('path');
const port = process.env.PORT || 3000;
const cors = require('cors');
var cookieParser = require('cookie-parser');
const session = require('express-session');

const vendorRouter = require('./routes/vendorRoutes');
const mongodbRouter = require('./routes/mongodbRoutes');
const loginRouter = require('./routes/loginRoutes');
const indexRouter = require('./routes/indexRouter');
const registerRouter = require('./routes/registerRouter');
const app = express();
// Set up session management
const MongoStore = require('connect-mongo');

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            dbName: process.env.AUTH_DB,
            collectionName: 'sessions',
        }),
        cookie: {
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        },
    })
);

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

function checkLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}
app.use('/', indexRouter);
app.use('/vendor', checkLogin, vendorRouter);
app.use('/db', mongodbRouter);
app.use('/register', registerRouter);
app.use('/auth', loginRouter);

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
});
module.exports = app;
