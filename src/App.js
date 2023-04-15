import {useEffect, useState} from 'react'
import Header from './components/Header';
import axios from 'axios';

function App() {

  const getCurrentTrack = async (e) => {
    const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      },
    })
    if (response) {
      let trackName = response.data.item.name,
          artistName = response.data.item.artists[0].name   // TODO: could be more than one artists
      return { trackName, artistName }
    } else {
      return null;
    }
  }

  const [track, setTrack] = useState({});

  useEffect(() => {
    const interval = setInterval(async () => {
      const newTrack = await getCurrentTrack();
      if (newTrack && JSON.stringify(newTrack) !== JSON.stringify(track)) {
        setTrack(newTrack);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getCurrentTrack]);

  const handleTrackChange = () => {
    // do something when the track changes
    console.log("new song: " + track.trackName + " from " + track.artistName);
  };

  useEffect(() => {
    if (Object.keys(track).length !== 0) {
      handleTrackChange();
    }
  }, [track]);

  return (
    <div className="container">
      <Header />
    </div>
  );
}

export default App;
