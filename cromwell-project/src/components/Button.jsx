

function Button({ children, ...rest }) {
  return <button style={{ backgroundColor: "red" }} {...rest}>{children}</button>;
}

export default Button;