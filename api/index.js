const express = require('express');
const authController = require('./routes/auth');
const convertController = require('./routes/convert.js')
const spotifyController = require('./routes/spotify.js')
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use('/auth', authController);
app.use('/convert', convertController);
app.use('/spotify', spotifyController);

app.listen(8080, () => {
    console.log('Server running on port 8080');
    console.log(`from server - the server address is ${process.env.SERVER_ADDRESS}`);
});