import axios from 'axios'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import Input from '../components/Input'
import ButtonLink from '../components/ButtonLink';
import verifyTokenHook from '../hooks/VerifyTokenHook';


function LoginPage({handleUpdateDetails, resetDetails, isUsernameValid, jwtKey}){
    const navigate = useNavigate();

    const defaultDetailsState = {username:"", 
                                 password:""}

    const [loginDetails, setLoginDetails] = useState({...defaultDetailsState})
    const [errorMsg, setErrorMsg] = useState("");

    
    // custom hook?
    // useEffect(() => {
    //     if(localStorage.getItem(jwtKey)) {
    //         navigate("/home");
    //     }
    // }, []);
    

    async function validateLogin(event){
        event.preventDefault();

        if(!isUsernameValid(loginDetails.username, setErrorMsg)){
            resetDetails(["username"], setLoginDetails);
            return -1;            
        }

        try{
            const response = await axios.post("http://localhost:5000/user/login", loginDetails);
            const status = response.status;
            const payloadData = response.data;

            const STATUS_SUCCESS_MIN = 200;
            const STATUS_SUCCESS_MAX = 299;

            if(status === 404){
                resetDetails(["username"], setLoginDetails);
                setErrorMsg();
                return -1;
            }

            if(status === 400){
                resetDetails(["password"], setLoginDetails);
                setErrorMsg();
                return -1;
            }
            
            if(status >= STATUS_SUCCESS_MIN && status <= STATUS_SUCCESS_MAX){
                localStorage.setItem(jwtKey, JSON.stringify(payloadData));
                // console.log(payloadData)

                setLoginDetails({...defaultDetailsState});
                setErrorMsg("");

                navigate('/home');
            }
            
        }catch(err){
            console.error(err);
        }
    }

    return (
        <>
             <ButtonLink destination={"/"}>Back</ButtonLink>

            <form onSubmit={validateLogin}>  
                <Input type='text' 
                       placeholder='username...' 
                       maxLength={30}
                       onChange={(event) => handleUpdateDetails("username", event, setLoginDetails)}>
                </Input>

                <Input type='password' 
                       placeholder='password...'
                       onChange={(event) => handleUpdateDetails("password", event, setLoginDetails)}>
                </Input>

                <Button type='submit'>Login</Button>
            </form>

            <h1>{loginDetails.email}</h1>
            <h1>{loginDetails.password}</h1>

            <h3>Don't have an account? <ButtonLink destination={"/register"}>Register</ButtonLink></h3>
        </>
    )
}

export default LoginPage;