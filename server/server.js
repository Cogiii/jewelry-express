const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { connection } = require('./config/databaseConfig');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const { ensureAuthenticated, ensureNotAuthenticated } = require('./middleware/auth');
const adminRoutes = require('./routes/admin')

const app = express();
const port = 3000;

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static('client/public', {
    index: false, // Prevent serving index.html automatically
}));
app.use(express.static('client/admin', {
    index: false, // Prevent serving index.html automatically
}));

// Session middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to protect the /admin directory
app.use('/admin', ensureAuthenticated, express.static(path.join(__dirname, 'client/admin')));

app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));