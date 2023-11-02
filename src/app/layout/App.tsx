import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "semantic-ui-react";
import Navbar from "./Navbar";
import './styling.css';
import HomePage from "../../features/home/HomePage";

const App = () => {
    const location = useLocation();

    return (
        <>
            {location.pathname === '/' ? (<HomePage />) : (
                <>
                    <Navbar />
                    <Container style={{ marginTop: '7em' }}>
                        <Outlet />
                    </Container>
                </>
            )}

        </>
    )
}

export default observer(App)