const express = require("express");
const router = express.Router();
const axios = require("axios");
const cors = require("cors");

require("dotenv").config();

// TODO: User not logged in will cause an error ( { error: { status: 401, message: 'The access token expired' } })
router.get("/currentTrack", (req, res) => {
  const access_token = req.query.access_token;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const url = "https://api.spotify.com/v1/me/player/currently-playing";

  axios
    .get(url, { headers: headers })
    .then(response => {
      if (response !== undefined && response.status !== 204) {
        const trackName = response.data.item.name;
        const artistName = response.data.item.artists[0].name; // TODO: could be more than one artists
        const trackID = response.data.item.id;
        const trackImg = response.data.item.album.images[0].url;
        const progress_ms = response.data.progress_ms;

        res.send({
          status: 0,
          trackName: trackName,
          artistName: artistName,
          trackID: trackID,
          trackImg: trackImg,
          progress_ms: progress_ms,
        });
      } else if (response.status === 204) {
        res.send({
          status: 1,
        });
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        res.send({
          status: -1,
          error: error.response.status
        });
      }
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
