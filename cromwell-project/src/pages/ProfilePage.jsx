import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

function ProfilePage({jwtKey}){
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    
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
            <section className='profile-section'>
                 <div className='btn-wrapper'><BackButton destination={"/home"}/></div>
                    <div className='user-info-wrapper'>
                        {/* i made shows id and password as well, for testing */}
                        {Object.entries(user).map((data) => (
                            <p key={data[0]} className={`${data[0]}-info`}>
                                <span>{`${data[0]}:`}</span> {data[1] ?? ''}
                            </p>
                        ))}
                    </div>
            </section>
        )
}

export default ProfilePage;