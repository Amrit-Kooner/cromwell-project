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
            {parsedUserToken.username}
        </>
    )
}

export default HomePage;