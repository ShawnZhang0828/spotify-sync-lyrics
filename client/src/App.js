import { useEffect, useState } from "react";
import Header from "./components/Header";
import Lyrics from "./components/Lyrics";
import axios from "axios";
import { parse } from "@fortawesome/fontawesome-svg-core";

// const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
// const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8"
const REFRESH_URL = "http://localhost:8080/auth/refresh_token/";

function App() {
  // get track information about the currently playing track
  const getCurrentTrack = async () => {
    if (window.localStorage.getItem("code") === null) {
      return;
    }
    try {
      // send a request to the spotify api
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "access-token"
            )}`,
          },
        }
      );
      if (response !== undefined && response.status !== 204) {
        let trackName = response.data.item.name,
          artistName = response.data.item.artists[0].name, // TODO: could be more than one artists
          trackID = response.data.item.id,
          trackImg = response.data.item.album.images[0].url;
        return { trackName, artistName, trackID, trackImg };
      } else if (response.status === 204) {
        // return same track for a 204 (success no content error)
        let trackName = track.trackName,
          artistName = track.artistName,
          trackID = track.trackID,
          trackImg = track.trackImg;
        return { trackName, artistName, trackID, trackImg };
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      // if (error.response.status === 401) {
      //   window.localStorage.removeItem("access-token")
      // }
    }
  };

  // get the progress of the current track
  const getProgress = async () => {
    // don't send request if the user is not logged in
    if (window.localStorage.getItem("code") === null) {
      return;
    }
    try {
      // send request to the spotify api
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "access-token"
            )}`,
          },
        }
      );
      if (response !== undefined) {
        let startTime = response.data.progress_ms; // get current progress
        window.localStorage.setItem("is-playing", response.data.is_playing);
        return startTime;
      } else {
        window.localStorage.setItem("is-playing", "false");
        return null;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        window.localStorage.removeItem("code");
        window.localStorage.removeItem("access-token");
        window.localStorage.removeItem("refresh-token");
      }
    }
  };

  // triggered everytime a new track is played
  const handleTrackChange = async () => {
    setCurrentLineIndex(0); // lyrics line index reset
    setCurrentTime(await getProgress()); // to align with lyrics timestamp
    setTractStartTime(Date.now()); // use real time to keep track of the progress of the track
    await getLyrics(); // fetch lyrics of the current track
  };

  // parse lyrics line into lyrics object
  const parseLyricsLine = (line) => {
    const regex = /^(\[(\d{2}):(\d{2}).(\d{2,3})\])(.*)/;
    const match = line.match(regex);

    if (match) {
      const minutes = parseInt(match[2]);
      const seconds = parseInt(match[3]);
      const miliseconds = parseInt(match[4]);
      const line = match[5];

      return {
        words: line,
        startTimeMs: minutes * 60 * 1000 + seconds * 1000 + miliseconds,
      };
    }
  };

  // get lyrics of the current track
  const getLyrics = async () => {
    // TODO: handle un-synced lyrics
    try {
      var songId;
      try {
        // get song ID
        const idRequestBody = {
          keywords: `${track.artistName} ${track.trackName}`,
          type: 1,
        };
        const songIdResponse = await axios.get("http://localhost:3000/search", {
          params: idRequestBody,
        });
        songId = songIdResponse.data.result.songs[0].id;
      } catch (error) {
        console.error("Error when getting song ID: ", error);
        throw new Error("Cannot get song ID.");
      }
      // get song lyrics by ID
      const lyricsRequestBody = {
        id: songId,
      };
      const lyricsResponse = await axios.get("http://localhost:3000/lyric", {
        params: lyricsRequestBody,
      });
      if (lyricsResponse !== undefined) {
        const lines = lyricsResponse.data.lrc.lyric.trim();
        const parsedLines = lines
          .split("\n")
          .map((line) => parseLyricsLine(line));
        console.log(parsedLines);
        setLyrics(parsedLines); // update lyrics
      } else {
        console.log(lyricsResponse);
        return null;
      }
    } catch (error) {
      const emptyLyrics = Array.from({ length: 5 }, () => ({
        startTimeMs: 0,
        words: "",
      }));
      var lyrics = emptyLyrics;
      lyrics[2].words = "Lyrics Not Found.";
      setLyrics(lyrics);
      console.error("Error when getting lyrics: ", error);
      return null;
    }
  };

  // refresh token so that the user stays logged in
  const refreshToken = async () => {
    console.log("refreshing token");
    try {
      // send request through express API
      let response = await axios.get(REFRESH_URL, {
        params: {
          refresh_token: window.localStorage.getItem("refresh-token"),
        },
      });
      // Update the access token in your app state or local storage
      const newAccessToken = response.data.access_token;
      window.localStorage.setItem("access-token", newAccessToken);
      console.log("successfully refreshed token");
    } catch (error) {
      console.log(error);
    }
  };

  // initialize state variables
  const [track, setTrack] = useState({});
  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackStartTime, setTractStartTime] = useState(0);

  // triggered at every track change
  useEffect(() => {
    if (Object.keys(track).length !== 0) {
      setCurrentLineIndex(0);
      handleTrackChange();
      refreshToken(); // refresh the access token after every song
    }
  }, [track]);

  // general synchronization
  useEffect(() => {
    // asynchronze function to fetch a new track
    const fetchNewTrack = async () => {
      const newTrack = await getCurrentTrack();
      if (newTrack && JSON.stringify(newTrack) !== JSON.stringify(track)) {
        setTrack(newTrack);
      }
    };

    const intervalId = setInterval(async () => {
      // setCurrentTime(Date.now() - trackStartTime);
      var progress = Date.now() - trackStartTime + currentTime - 500;
      if (track) {
        const index = lyrics.findIndex((line) => line.startTimeMs >= progress); // Find the index of the line with a start time greater than or equal to the current time
        if (index !== -1 && index !== currentLineIndex) {
          setCurrentLineIndex(index > 0 ? index - 1 : 0);
        }
      }

      // check for new track only every two seconds
      if (progress % 2500 < 100) {
        fetchNewTrack();
      }

      // correct synchronization every two seconds
      if (progress % 2000 < 100) {
        let trackProgress = await getProgress();
        if (trackProgress !== undefined) {
          setCurrentTime(trackProgress);
        }
        setTractStartTime(Date.now());
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [currentTime, lyrics, trackStartTime]);

  useEffect(() => {
    if (window.localStorage.getItem("refresh-token") === "1") {
      setLyrics([]);
    }
  }, [window.localStorage.getItem("refresh-token")]);

  // render page elements
  return (
    <div className="container">
      {lyrics.length > 0 ? (
        <Lyrics
          lines={lyrics}
          currentLineIndex={currentLineIndex}
          bg_img={track.trackImg}
        />
      ) : (
        <Header />
      )}
    </div>
  );
}

export default App;
