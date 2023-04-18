const express = require('express');
const authController = require('./routes/auth');
const convertController = require('./routes/convert')
const cors = require('cors');

const app = express();

app.use('/auth', authController);
app.use('/convert', convertController);
app.use(cors());

app.listen(8080, () => {
    console.log('Server running on port 8080');
});