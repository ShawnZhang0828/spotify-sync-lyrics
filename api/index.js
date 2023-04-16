const express = require('express');
const authController = require('./routes/auth');
const cors = require('cors');

const app = express();

app.use('/auth', authController);
app.use(cors());

app.listen(8080, () => {
    console.log('Server running on port 8080');
});