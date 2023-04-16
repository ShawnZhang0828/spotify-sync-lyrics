const express = require('express');
const router = express.Router();
const querystring = require('querystring');
var request = require('request'); 

const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8"
const SCOPE = "user-read-currently-playing"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const LOGIN_REDIRECT = "http://localhost:8080/auth/callback"
const RESPONSE_TYPE = "code"

router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: LOGIN_REDIRECT,
        show_dialog: true
    }));
});

router.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    console.log(req.query.code);
    var code = req.query.code || null;

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: LOGIN_REDIRECT,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          // console.log(body);
        });

        // res.redirect("http://localhost:3000");

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
            code: code
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({error: 'invalid_token'}));
        }
      });
    }
);


module.exports = router;