const LoginButton = ({ onClick, text, href }) => {
  return (
    <button onClick={onClick} className="login-btn"><a href={href}>{text}</a></button>
  )
}

export default LoginButton