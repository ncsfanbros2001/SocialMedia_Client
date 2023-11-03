import { Link } from "react-router-dom"
import { Image, Header, Segment, Button, Container } from "semantic-ui-react"

const HomePage = () => {
    return (
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='../../../public/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>
                <Header as='h2' inverted>Welcome to Reactivities!</Header>
                <Button as={Link} to='/activities' size='huge' inverted>Take me to Reactivities!</Button>
            </Container>
        </Segment>
    )
}

export default HomePage