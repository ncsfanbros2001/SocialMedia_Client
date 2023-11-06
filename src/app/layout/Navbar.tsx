import { Button, Container, Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
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
            </Container>
        </Menu>
    )
}

export default Navbar