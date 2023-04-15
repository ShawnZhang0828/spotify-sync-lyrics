import {useEffect, useState} from 'react'
import LoginButton from "./LoginButton"
import '../styles/login.css'

const CLIENT_ID = "07f45b95ceac490ba0871336604107e0"
const SCOPE = "user-read-currently-playing"
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "token"

const Header = (props) => {
  
  const [token, setToken] = useState("")

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

  const login = (e) => {
    e.preventDefault()
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&show_dialog=true`
  }
  
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  return (
    <h1>Spotify React {token ? <LoginButton onClick={logout} text="logout"/> : <LoginButton onClick={login} text="login"/>} </h1>
  )
}



export default Header