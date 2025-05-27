import { useEffect, useState } from 'react'

// show user details on this page
// include a logout button

function HomePage({jwtKey}){
    const userToken = localStorage.getItem(jwtKey);
    const parsedUserToken = userToken ? JSON.parse(userToken) : null;

    useEffect(() => {
        if(!parsedUserToken) {
            console.error("Error fetching data");
            navigate("/");
        }
    },[])

    return (
        <>
            <section className='home-section'>
                <h2 className='home-heading'>Welcome, {parsedUserToken.username}!</h2>
            </section>
        </>
    )
}

export default HomePage;