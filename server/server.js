const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const { connection } = require('./config/databaseConfig');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/public')));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
// app.use('/login', loginRoutes);
// app.use('/admin', adminRoutes);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));