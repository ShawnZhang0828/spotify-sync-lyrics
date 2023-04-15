const LoginButton = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="login-btn">{text}</button>
  )
}

export default LoginButton