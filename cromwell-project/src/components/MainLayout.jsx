import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function MainLayout({jwtKey}){
    const navigate = useNavigate();

    const userToken = localStorage.getItem(jwtKey);
    const parsedUserToken = userToken ? JSON.parse(userToken) : null;

    // useEffect(() => {
    //     localStorage.removeItem(jwtKey);
    // }, [])


    useEffect(() => {
        if(!parsedUserToken) {
            console.error("Error fetching data");
            navigate("/");
        }
    },[])


    function handleLogout(){
        localStorage.removeItem(jwtKey);
        navigate("/");
    }

    return (
        <>
            <Header handleLogout={handleLogout}/>
            <Outlet/>
        </>
    )
}

export default MainLayout;