import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import Input from '../components/Input'
import ButtonLink from '../components/ButtonLink';
import verifyTokenHook from '../hooks/VerifyTokenHook';


function RegisterPage({handleUpdateDetails, resetDetails, isUsernameValid, jwtKey}){
    const navigate = useNavigate();

    const defaultDetailsState = {username:"",
                                 email:"", 
                                 password:"",
                                 confirmPassword:""}
    const [registerDetails, setRegisterDetails] = useState({...defaultDetailsState})
    const [errorMsg, setErrorMsg] = useState("");



    // TODO: TEST THIS
    // useEffect(() => {
    //     const storedToken = localStorage.getItem(jwtKey);
    //     const parsedUserToken = storedToken ? JSON.parse(storedToken) : null;

    //     if(!storedToken){
    //         console.error("No token");
    //         navigate("/");
    //         return;
    //     }

    //     async function verifyToken(destination) {
    //         try {
    //             const response = await axios.post("/verify", {},
    //              { headers: { Authorization: `Bearer ${parsedUserToken.token}` } }
    //         );

    //             if(response.status === 200) navigate(destination);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }

    //     verifyToken("/home");
    // }, [localStorage.getItem(jwtKey)]);


    

      //#
    function isPasswordValid() {
        const { password, confirmPassword } = registerDetails;

        const MIN_PASSWORD_LEN = 10;
        const specialCharRegexPattern = /[^a-zA-Z0-9]/;
        const numberRegexPattern = /\d/;

        const hasNumber = numberRegexPattern.test(password);
        const hasSpecialChar = specialCharRegexPattern.test(password);

        let passwordErrorMsg = "";

        if (password.length < MIN_PASSWORD_LEN) {
            passwordErrorMsg = `Password too short, minimum length must be ${MIN_PASSWORD_LEN} NOT ${password.length}.`;
        } else if (password !== confirmPassword) {
            passwordErrorMsg = "Passwords do not match.";
        } else if (!hasSpecialChar) {
            passwordErrorMsg = "Password needs at least one special character.";
        } else if (!hasNumber) {
            passwordErrorMsg = "Password needs at least one number.";
        }

        const isValid = (passwordErrorMsg.length === 0);

        if (!isValid) {
            setErrorMsg(passwordErrorMsg);
        }

        return isValid;
    }

    //#
    function isEmailValid() {
        const email = registerDetails.email;
        const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isEmailValid = emailRegexPattern.test(email);

        if(!isEmailValid){
            setErrorMsg();
        }

        return isEmailValid;
    }


    async function validateRegisterDetails(event) {
        event.preventDefault();

        if(!isUsernameValid(registerDetails.username, setErrorMsg)){
            resetDetails(["username"], setRegisterDetails);
            return -1;            
        }

        if(!isEmailValid(registerDetails)){
            resetDetails(["email"], setRegisterDetails);
            return -1;
        }

        if(!isPasswordValid()){
            resetDetails(["password, confirmPassword"], setRegisterDetails);
            return -1;
        }


        try {
            const response = await axios.post("http://localhost:5000/user/register", registerDetails);
            const status = response.status;
            const payloadData = response.data;

            const STATUS_SUCCESS_MIN = 200;
            const STATUS_SUCCESS_MAX = 299;

            // MAYBE NO RIGHT
            if (status === 400) {
                resetDetails(["username"], setRegisterDetails);
                setErrorMsg(); //already exists
                return -1;
            } else if (status === 400) {
                resetDetails(["email"], setRegisterDetails);
                setErrorMsg(); //already exists
                return -1;
            }

            if (status >= STATUS_SUCCESS_MIN && status <= STATUS_SUCCESS_MAX) {
                console.log(status, payloadData);

                setRegisterDetails({...defaultDetailsState});
                setErrorMsg("");
                
                navigate("/login");
            }

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <>  
            <ButtonLink destination={"/"}>Back</ButtonLink>

            <form onSubmit={validateRegisterDetails}> 
                <Input type='text' 
                       placeholder='username...' 
                       value = {registerDetails.username}
                       maxLength={30}
                       onChange={(event) => handleUpdateDetails("username", event, setRegisterDetails)}>
                </Input>

                <Input type='email' 
                       placeholder='email...' 
                       value = {registerDetails.email}
                       maxLength={254}
                       onChange={(event) => handleUpdateDetails("email", event, setRegisterDetails)}>
                </Input>

                <Input type='password' 
                       placeholder='password...'
                       value = {registerDetails.password}
                       onChange={(event) => handleUpdateDetails("password", event, setRegisterDetails)}>
                </Input>

                <Input type='password' 
                       placeholder='confirm password...'
                       value = {registerDetails.confirmPassword}
                       onChange={(event) => handleUpdateDetails("confirmPassword", event, setRegisterDetails)}>
                </Input>

                <Button type='submit'>Register</Button>
            </form>

            <h3>Already have an account? <ButtonLink destination={"/login"}>Login in</ButtonLink></h3>

            <h1>{registerDetails.email}</h1>
            <h1>{registerDetails.password}</h1>
            <h1>{registerDetails.confirmPassword}</h1>
            <h1>{errorMsg}</h1>
        </>
    )
}

export default RegisterPage;