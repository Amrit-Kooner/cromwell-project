import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "../components/Button";
import Input from "../components/Input";
import ButtonLink from "../components/ButtonLink";
import verifyTokenHook from "../hooks/VerifyTokenHook";
import { updateLoginDetails, resetDetails, clearDetails, setErrorMsg } from '../redux/slices/authUserSlice'
import BackButton from "../components/BackButton";


function LoginPage({ isUsernameValid, jwtKey }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginDetails = useSelector((state) => state.authUser.loginDetails);
  const errorMsg = useSelector((state) => state.authUser.errorMsg);


    // custom hook?
    useEffect(() => {
        if (localStorage.getItem(jwtKey)) {
            navigate("/home");
        }
    }, []);


  async function validateLogin(event) {
    event.preventDefault();

    if (!isUsernameValid(loginDetails.username, (msg) => dispatch(setErrorMsg(msg)))) {
      dispatch(resetDetails(["username"]));
      return -1;
    }

    try {
      const response = await axios.post("http://localhost:5000/user/login", loginDetails);
      const status = response.status;
      const payloadData = response.data;

      if (status === 404) {
        dispatch(resetDetails(["username"]));
        dispatch(setErrorMsg("User not found."));
        return -1;
      }

      if (status === 400) {
        dispatch(resetDetails(["password"]));
        dispatch(setErrorMsg("Incorrect password."));
        return -1;
      }

      if (status >= 200 && status <= 299) {
        localStorage.setItem(jwtKey, JSON.stringify(payloadData));
        dispatch(resetDetails(["username", "password"]));
        dispatch(setErrorMsg(""));
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(key, event) {
    dispatch(updateLoginDetails({ key, value: event.target.value.trim() }));
  }

return (
  <>
    <section className="login-section">
      <div className='btn-wrapper'><BackButton destination={"/"} /></div>

      <form className="login-form" onSubmit={validateLogin}>
        <Input
          className="login-input"
          type="text"
          placeholder="username..."
          maxLength={30}
          onChange={(e) => handleChange("username", e)}
          value={loginDetails.username}
        />

        <Input
          className="login-input"
          type="password"
          placeholder="password..."
          onChange={(e) => handleChange("password", e)}
          value={loginDetails.password}
        />

        <Button className="submit-btn" type="submit">
          Login
        </Button>
      </form>

      <h3 className="switch-text">
        Don't have an account?{" "}
        <ButtonLink
          destination={"/register"}
          onClick={() => {
            dispatch(clearDetails("loginDetails"));
            dispatch(setErrorMsg(""));
          }}
        >
          Register
        </ButtonLink>
      </h3>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </section>
  </>
);
}

export default LoginPage;
