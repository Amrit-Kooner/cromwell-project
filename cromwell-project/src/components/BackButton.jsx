import ButtonLink from "./ButtonLink";
import {FiCornerDownLeft} from 'react-icons/fi'

function BackButton({destination}){
    return <ButtonLink className={"back-btn btn"} title="Go Back" destination={destination}>
        <FiCornerDownLeft/>
    </ButtonLink>
}

export default BackButton;