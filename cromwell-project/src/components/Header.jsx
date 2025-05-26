import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';

function Header({handleLogout}){

    return (
        <div>
            <Button onClick={handleLogout}>logout</Button>
            <ButtonLink destination={`/home/profile`}>profile</ButtonLink>
        </div>
    )

}

export default Header;