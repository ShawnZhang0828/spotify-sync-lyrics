import {useEffect, useState} from 'react';
import Header from './components/Header';
import Lyrics from './components/Lyrics';
import axios from 'axios';

function App() {

  const getCurrentTrack = async () => {
    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
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
  }

  const handleTrackChange = async () => {
    // do something when the track changes
    setCurrentLineIndex(0);
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
      }
    } catch (error) {
        setLyrics([{startTimeMs: 0, words: " "}]);
        console.log("lyrics not found");
    }
    
    
  }

  const getProgress = async () => {
    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      },
    })
    if (response) {
      let trackStatus = response.data.progress_ms
      return trackStatus
    } else {
      return null;
    }
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=refresh_token&refresh_token=' + encodeURIComponent(refreshToken), 
        { headers: { Authorization: `Bearer ${window.localStorage.getItem("token")}` } }
      );
      const newAccessToken = response.data.access_token;
      window.localStorage.setItem('token', newAccessToken);
    } catch (error) {
      console.log('Error refreshing token:', error);
    }
  };
  
  // Refresh token every 10 minutes
  setInterval(() => {
    refreshToken();
  }, 10 * 60 * 1000); // 10 minutes in milliseconds

  const [track, setTrack] = useState({});
  const [lyrics, setLyrics] = useState({});
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newTrack = await getCurrentTrack();
      if (newTrack && JSON.stringify(newTrack) !== JSON.stringify(track)) {
        setTrack(newTrack);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getCurrentTrack]);

  useEffect(() => {
    if (Object.keys(track).length !== 0) {
      setCurrentLineIndex(0);
      handleTrackChange();
    }
  }, [track]);

  useEffect(() => {
    if (lyrics.length > 0) {
      const timer = setInterval(async () => {
        const currentTime = await getProgress(); // Get the current time of the track
        const index = lyrics.findIndex((line) => line.startTimeMs >= currentTime); // Find the index of the line with a start time greater than or equal to the current time
        if (index !== -1 && index !== currentLineIndex) {
          setCurrentLineIndex(index > 0 ? index - 1 : 0);
        }
      }, 300); // Check every 100 milliseconds
      return () => clearTimeout(timer);
    }
  }, [lyrics, currentLineIndex]);

  return (
    <div className="container">
      {lyrics.length > 0 ? <Lyrics lines={lyrics} currentLineIndex={currentLineIndex} bg_img={track.trackImg}/> : <Header />}
    </div>
  );
}

export default App;
