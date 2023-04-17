import {useEffect, useState} from 'react'
import LoginButton from "./LoginButton"
import '../styles/login.css'

// const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
// const CLIENT_SECRET = "2896dd203a234606ab0e2ba2a2aa5ad8"
// const SCOPE = "user-read-currently-playing"
const LOGIN_URI = "http://localhost:8080/auth/login"
// const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
// const RESPONSE_TYPE = "code"

const Header = ({ props }) => {

  const logout = async () => {
    setCode("")
    window.localStorage.removeItem("code")
    window.localStorage.removeItem("access-token")
    window.localStorage.removeItem("refresh_token")
  }
  
  const [code, setCode] = useState("")

  useEffect(() => {
    const search = window.location.search
    let code = window.localStorage.getItem("code")

    if (!code && search) {
      const urlParams = new URLSearchParams(window.location.search);
      console.log(urlParams);

      window.localStorage.setItem("code", urlParams.get('code'))
      window.localStorage.setItem("access-token", urlParams.get('access_token'))
      window.localStorage.setItem("refresh-token", urlParams.get('refresh_token'))
      
    }

    setCode(code)
  }, []);

  return (
    // <h1>Spotify React {code ? <LoginButton onClick={logout} text="logout"/> : <LoginButton onClick={login} text="login"/>} </h1>
    <h1>Spotify React {code ? <LoginButton onClick={logout} text="logout"/> : <LoginButton onClick={logout} text="login" href={LOGIN_URI}/>} </h1>
  )
}

export default Header