import Container from 'react-bootstrap/esm/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

const Navigation = () => {
    const { currentUser } = useAuthContext()
    return (
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="pb-3">
            <Container>
                <Navbar.Brand as={Link} to="/">My Reviewish List</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {currentUser && (
                            <Nav.Link as={NavLink} to="/logout">Log out</Nav.Link>
                        )}

                        {!currentUser && (
                            <>
                                <Nav.Link as={NavLink} to="/">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/signup">Signup</Nav.Link>
                            </>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
		</Navbar>
    )
}

export default Navigation
