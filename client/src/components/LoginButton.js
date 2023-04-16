const LoginButton = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className="login-btn"><a href={text}></a></button>
  )
}

export default LoginButton