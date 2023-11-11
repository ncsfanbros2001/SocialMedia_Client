import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

const Navbar = () => {
    const { userStore: { user, logout } } = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header as={NavLink} to='/'>
                    <img src='/logo.png' alt='logo' style={{ marginRight: 10 }} /> Reactivities
                </Menu.Item>

                <Menu.Item name='Activities' as={NavLink} to='/activities' />

                <Menu.Item name='Errors' as={NavLink} to='/errors' />

                <Menu.Item name='Activities'>
                    <Button positive content='Create Activity' as={NavLink} to='/createActivity' />
                </Menu.Item>

                <Menu.Item position='right'>
                    <Image src={user?.image || '../../../public/user.png'} avatar spaced='right' />
                    <Dropdown pointing='top left' text={user?.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={`/profile/${user?.username}`} text='My Profile' icon='user' />
                            <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Container>
        </Menu>
    )
}

export default observer(Navbar)