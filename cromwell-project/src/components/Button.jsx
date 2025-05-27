

function Button({ children, ...rest }) {
  return <button className="main-btn btn" {...rest}>{children}</button>;
}

export default Button;