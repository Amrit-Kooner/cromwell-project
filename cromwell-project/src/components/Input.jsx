import { useState } from "react";

function Input({type, onChange, ...rest}){
  const [togglePasswordShow, setTogglePasswordShow] = useState(false);
  const [passwordLen, setPasswordLen] = useState(0);
  
  const isTypePassword = type === "password";

  function handlePasswordLen(event) {
    if(isTypePassword) setPasswordLen(event.target.value.length);
  };

  return (
    <div className="input-auth-wrapper">
      <input
        className="input-auth"
        type={isTypePassword && !togglePasswordShow ? "password" : "text"}
        {...rest}
        onChange={(event) => {
          onChange(event);
          handlePasswordLen(event);
        }}/>
        
      {isTypePassword && passwordLen !== 0 && (
        <button
          type="button"
          className="toggle-password-btn btn"
          title="Toggle"
          onClick={() => setTogglePasswordShow(!togglePasswordShow)}>
          {togglePasswordShow ? "hide" : "show"}
        </button>
      )}
    </div>
  )
}

export default Input;
