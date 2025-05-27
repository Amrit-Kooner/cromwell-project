import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function MainLayout({jwtKey}){
    const navigate = useNavigate();

    function handleLogout(){
        localStorage.removeItem(jwtKey);
        navigate("/");
    }
    
    return (
        <main className='main'>
            <Header handleLogout={handleLogout}/>
            
            <div className='container'>
                <Outlet/>
            </div>
        </main>
    )
}

export default MainLayout;