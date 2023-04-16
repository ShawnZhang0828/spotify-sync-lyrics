const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const { clearInterval } = require('timers');

const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8"
const SCOPE = "user-read-currently-playing"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const LOGIN_REDIRECT = "http://localhost:3000/callback"
const RESPONSE_TYPE = "code"

router.get('/login', function(req, res) {
    console.log("login!!!");
    
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: LOGIN_REDIRECT
    }));

    console.log("Redirected done");
});

router.get('/callback', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });



module.exports = router;