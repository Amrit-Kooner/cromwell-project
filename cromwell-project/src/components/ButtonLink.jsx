import { Link } from "react-router-dom";

function ButtonLink({destination, children, ...rest}){
    return <Link className="link-btn btn" to={destination} {...rest}>{children}</Link>
}

export default ButtonLink;