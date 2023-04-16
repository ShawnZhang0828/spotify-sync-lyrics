import {useEffect, useState} from 'react'
import axios from 'axios';
import qs from 'qs'
import { Buffer } from 'buffer';
import LoginButton from "./LoginButton"
import '../styles/login.css'

const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8"
const SCOPE = "user-read-currently-playing"
const REDIRECT_URI = "http://localhost:3000/auth/login"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"

const Header = ({ props }) => {

  const getUserData = async (code) => {
    console.log((CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'));
    try {
      const headers = {
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        // auth: {
        //   code: code
        // },
      };
      const data = {
        grant_type: 'authorization_code',
        code: code
      };

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify(data),
        headers
      );
      const userData = response.data;
      const refreshToken = userData.refresh_token;
      window.localStorage.setItem("refresh-token", (CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      return refreshToken;
    } catch (error) {
      window.localStorage.setItem("refresh-token", error)
      window.localStorage.setItem("refresh-token2", btoa(CLIENT_ID + ':' + CLIENT_SECRET))
    }
  }

  const login = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('/auth/login');
      console.log("get response");
      console.log(response);
      // window.location.replace(response.data.url);
    } catch (error) {
      console.error(error);
    }
  }
  
  const logout = async () => {
    setCode("")
    // try {
    //   const response = await axios.get(`/api/auth/login`);
    //   window.location.replace(response.data.url);
    // } catch (error) {
    //   console.error(error);
    // }
  }
  
  const [code, setCode] = useState("")

  useEffect(() => {
    const search = window.location.search
    let code = window.localStorage.getItem("code")

    if (!code && search) {
      const urlParams = new URLSearchParams(window.location.search);
      code = urlParams.get('code');
      
      getUserData(code).then(() => {
        window.location.search = ""
        window.localStorage.setItem("code", code)
      })
    }

    setCode(code)
  }, []);

  return (
    // <h1>Spotify React {code ? <LoginButton onClick={logout} text="logout"/> : <LoginButton onClick={login} text="login"/>} </h1>
    <h1>Spotify React {code ? <LoginButton onClick={logout} text="logout"/> : <a href='/auth/login'>Login</a>} </h1>
  )
}

export default Header