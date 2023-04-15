import {useEffect, useState} from 'react';
import Header from './components/Header';
import axios from 'axios';

function App() {
  const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
  const SCOPE = "user-read-currently-playing"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(element => element.startsWith("access_token")).split("=")[1]
      
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, []);

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtist = async (e) => {
    e.preventDefault();
    console.log(token);
    const data = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    console.log(data);
  }

  return (
    <div className="container">
      <Header />
      {!token ? 
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
      : <button onClick={logout}>Logout</button>
      }
      {token ? 
        <form onSubmit={searchArtist}>
          <input type='text' onChange={e => setSearchKey(e.target.value)}></input>
          <button type='submit'>Search</button>
        </form>
        : <h2>please login</h2>
      }
    </div>
  );
}

export default App;
