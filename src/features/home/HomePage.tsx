import { Link } from "react-router-dom"
import { Image, Header, Segment, Button, Container } from "semantic-ui-react"
import { useStore } from "../../app/stores/store"
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

const HomePage = () => {
    const { userStore, modalStore } = useStore();

    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='../../../public/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>

                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted>Welcome to Reactivities!</Header>
                        <Button as={Link} to='/activities' size='huge' inverted>Go To Activities</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>Login</Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>Register</Button>
                    </>
                )}
            </Container>
        </Segment>
    )
}

export default observer(HomePage)