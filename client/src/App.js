import {useEffect, useState} from 'react';
import Header from './components/Header';
import Lyrics from './components/Lyrics';
import axios from 'axios';

// const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
// const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8"
const REFRESH_URL = "http://localhost:8080/auth/refresh_token/"

function App() {

  const getCurrentTrack = async () => {
    if (window.localStorage.getItem("code") === null) {
      return;
    }
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("access-token")}`
        },
      })
      if (response !== undefined) {
        let trackName = response.data.item.name,
            artistName = response.data.item.artists[0].name,   // TODO: could be more than one artists
            trackID = response.data.item.id,
            trackImg = response.data.item.album.images[0].url
        return { trackName, artistName, trackID, trackImg }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        window.localStorage.removeItem("access-token")
      }
    }
    
  }

  const getProgress = async () => {
    if (window.localStorage.getItem("code") === null) {
      return;
    }
    try {
      const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("access-token")}`
        },
      })
      if (response !== undefined) {
        let startTime = response.data.progress_ms
        return startTime
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        window.localStorage.removeItem("access-token")
      }
    }
  }

  const handleTrackChange = async () => {
    // do something when the track changes
    setCurrentLineIndex(0);
    setCurrentTime(await getProgress());
    setTractStartTime(Date.now());
    await getLyrics();
  };

  const getLyrics = async () => {
    try {
      const response = await axios.get(`https://spotify-lyric-api.herokuapp.com/?trackid=${track.trackID}`, {})
      if (response !== undefined) {
        var lines = response.data.lines.map(lineObj => {
          delete lineObj.endTimeMs;
          delete lineObj.syllables;
          return lineObj;
        })
        setLyrics(lines);
      } else {
        setLyrics([{startTimeMs: 0, words: " "}]);
        console.log("lyrics not found");
        return null
      }
    } catch (error) {
        setLyrics([{startTimeMs: 0, words: " "}]);
        console.log("lyrics not found");
        return null
    }
    
  }

  const refreshToken = async () => {
    console.log("refreshing token");
    try {
      let response = await axios.get(REFRESH_URL, {
        params: {
          refresh_token: window.localStorage.getItem("refresh-token")
        }
      })
      // Update the access token in your app state or local storage
      const newAccessToken = response.data.access_token;
      window.localStorage.setItem("access-token", newAccessToken)
      console.log("successfully refreshed token");
    } catch (error) {
      console.log(error);
    }
  }

  const [track, setTrack] = useState({});
  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackStartTime, setTractStartTime] = useState(0);

  useEffect(() => {
    if (Object.keys(track).length !== 0) {
      setCurrentLineIndex(0);
      handleTrackChange();
      refreshToken();   // refresh the access token after every song
    }
  }, [track]);

  useEffect(() => {
    const fetchNewTrack = async () => {
      const newTrack = await getCurrentTrack();
      if (newTrack && JSON.stringify(newTrack) !== JSON.stringify(track)) {
        setTrack(newTrack);
      }
    };

    const intervalId = setInterval(() => {
      // setCurrentTime(Date.now() - trackStartTime);
      var progress = Date.now() - trackStartTime + currentTime;
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
    }, 100);
    return () => clearInterval(intervalId);
  }, [currentTime, lyrics]);

  return (
    <div className="container">
      {lyrics.length > 0 ? <Lyrics lines={lyrics} currentLineIndex={currentLineIndex} bg_img={track.trackImg}/> : <Header initToken={window.localStorage.getItem("token")}/>}
    </div>
  );
}

export default App;
