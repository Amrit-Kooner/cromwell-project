import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonLink from '../components/ButtonLink';
import verifyTokenHook from '../hooks/VerifyTokenHook';

function AuthPage({jwtKey}){
    const navigate = useNavigate();
    
    
    //custom hook?
    useEffect(() => {
        if (localStorage.getItem(jwtKey)) {
            navigate("/home");
        }
    }, []);


    return (
        <section className="auth-section">
            <div className="btn-wrapper">
                <ButtonLink destination={"/login"}>Login</ButtonLink>
                <ButtonLink destination={"/register"}>Sign up</ButtonLink>
            </div>
        </section>
    )
}

export default AuthPage;