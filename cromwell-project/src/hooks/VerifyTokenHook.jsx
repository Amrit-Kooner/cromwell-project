import { useEffect } from "react";

// TO DO: VERIFY TOKEN

function verifyTokenHook(destination){
    //     useEffect(() => {
    //     if (!storedToken) {
    //         console.error("No token");
    //         navigate("/");
    //         return;
    //     }

    //     async function verifyToken(destination) {
    //         try {
    //         const response = await axios.post(
    //             "/verify",
    //             {},
    //             { headers: { Authorization: `Bearer ${parsedUserToken.token}` } }
    //         );

    //         if (response.status === 200) navigate(destination);
    //         } catch (err) {
    //         console.error(err);
    //         }
    //     }

    //     verifyToken("/");
    // }, [localStorage.getItem(jwtKey)]);
}

export default verifyTokenHook;