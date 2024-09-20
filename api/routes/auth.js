const express = require("express");
const router = express.Router();
const querystring = require("querystring");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const CLIENT_ID = "07f45b95ceac490ba0871336604107e0";
const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8";
const SCOPE = "user-read-currently-playing user-modify-playback-state";
const LOGIN_REDIRECT = process.env.SERVER_ADDRESS + "auth/callback";

// perform login via spotify api
router.get("/login", function (req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: LOGIN_REDIRECT,
        show_dialog: true,
      })
  );
});

router.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      code: code,
      redirect_uri: LOGIN_REDIRECT,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    json: true,
  };

  // post request for refresh and access token
  axios
    .post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // redirect back to the React fontend with requested access token and refresh token
        res.redirect(
          process.env.CLIENT_ADDRESS +
            "?" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
              code: code,
            })
        );
      } else {
        res.redirect("/#" + querystring.stringify({ error: "invalid_token" }));
      }
    })
    .catch((error) => {
      res.redirect(
        "/#" + querystring.stringify({ error: error.response.status })
      );
    });
});

// refresh access token using spotify API
router.get("/refresh_token", function (req, res) {
  var refresh_token = req.query.refresh_token;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
  };

  axios
    .post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    .then((response) => {
      if (response.status === 200) {
        res.send({
          access_token: response.data.access_token,
        });
      }
    })
    .catch((error) => {
      console.log(`error when fetching refresh token - ${error.message}`);
    });
});

// enable cors
router.use(
  cors({
    origin: "http://localhost:4000", // Allow only this origin
    methods: "GET,POST", // Allowed methods
  })
);

module.exports = router;
