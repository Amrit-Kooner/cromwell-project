import { Link } from "react-router-dom";

function ButtonLink({destination, children}){
    return <Link style={{backgroundColor:"green"}} to={destination}>{children}</Link>
}

export default ButtonLink;