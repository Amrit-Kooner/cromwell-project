import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import {FiLogOut, FiUser} from 'react-icons/fi'

function Header({handleLogout}){

    return (
        <header className='header'>
            <div className='btn-wrapper'>
                <ButtonLink destination={`/home/profile`} title={"Your Profile"}>
                    <FiUser/>
                </ButtonLink>
                
                <Button onClick={handleLogout} title={"Logout"}>
                    <FiLogOut/>
                </Button>
            </div>
        </header>
    )

}

export default Header;