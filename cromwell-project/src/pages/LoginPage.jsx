import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "../components/Button";
import Input from "../components/Input";
import ButtonLink from "../components/ButtonLink";
import verifyTokenHook from "../hooks/VerifyTokenHook";
import { resetDetails, setErrorMsg, updateDetails } from "../redux/slices/authUserSlice";


function LoginPage({ isUsernameValid, jwtKey }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginDetails = useSelector((state) => state.authUser.loginDetails);
  const errorMsg = useSelector((state) => state.authUser.errorMsg);

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
    dispatch(updateDetails({ key, value: event.target.value.trim() }));
  }

  return (
    <>
      <ButtonLink destination={"/"}>Back</ButtonLink>

      <form onSubmit={validateLogin}>
        <Input
          type="text"
          placeholder="username..."
          maxLength={30}
          onChange={(e) => handleChange("username", e)}
          value={loginDetails.username}
        />

        <Input
          type="password"
          placeholder="password..."
          onChange={(e) => handleChange("password", e)}
          value={loginDetails.password}
        />

        <Button type="submit">Login</Button>
      </form>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <h3>
        Don't have an account? <ButtonLink destination={"/register"}>Register</ButtonLink>
      </h3>
    </>
  );
}

export default LoginPage;

