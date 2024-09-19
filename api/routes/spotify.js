const express = require("express");
const router = express.Router();
var request = require("request");
const cors = require("cors");

require("dotenv").config();

router.get("/currentTrack", (req, res) => {
  var access_token = req.query.access_token;
  const response = request.get(
    {
      url: "https://api.spotify.com/v1/me/player/currently-playing",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
    (error, response, body) => {
      const data = JSON.parse(body);
      if (response !== undefined && response.status !== 204) {
        const trackName = data.item.name;
        const artistName = data.item.artists[0].name; // TODO: could be more than one artists
        const trackID = data.item.id;
        const trackImg = data.item.album.images[0].url;
        const progress_ms = data.progress_ms;

        res.send({
          status: 0,
          trackName: trackName,
          artistName: artistName,
          trackID: trackID,
          trackImg: trackImg,
          progress_ms: progress_ms
        });
      } else if (response.status === 204) {
        // return same track for a 204 (success no content error)
        res.send({
          status: 1,
        });
      } else {
        res.send({
          status: -1,
        });
      }
    }
  );
});

// enable cors
router.use(
  cors({
    origin: "http://localhost:4000", // Allow only this origin
    methods: "GET,POST", // Allowed methods
  })
);

module.exports = router;
