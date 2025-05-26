import { useState, useEffect } from 'react'
import ButtonLink from '../components/ButtonLink';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage({jwtKey}){
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const {username, email} = user;

    
    useEffect(() => {
        if (!localStorage.getItem(jwtKey)) {
            navigate("/");
        }
    }, []);

    
    useEffect(() => {
        const userToken = localStorage.getItem(jwtKey);
        const parsedUserToken = userToken ? JSON.parse(userToken) : null;

        if(!parsedUserToken || !userToken) {
            console.error("No token");
            navigate("/");
            return;
        }

        async function fetchData() {
            try{
                const response = await axios.get("http://localhost:5000/user", {
                    headers: {
                        Authorization: `Bearer ${parsedUserToken.token}`
                    }
                });

                setUser(response.data);
            } catch(err){
                console.error(err);
            }
        }

        fetchData();
    },[])

        return (
        <>
            <ButtonLink destination={"/home"}>Back</ButtonLink>
            <h1>{username ?? ''}</h1>
            <h1>{email ?? ''}</h1>
        </>
        )
}

export default ProfilePage;