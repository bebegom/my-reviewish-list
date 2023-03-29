import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, NavLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuthContext } from '../contexts/AuthContext'
import { getMovieGenres, getTvshowGenres } from '../services/tmdbAPI'

const Navigation = () => {
    const { currentUser } = useAuthContext()
    const { data: movieGenresData } = useQuery(['movieGenres'], getMovieGenres)
    const { data: tvshowGenreData } = useQuery(['tvshowGenres'], getTvshowGenres)

    return (
        <Navbar collapseOnSelect expand="lg" className="nav">
            <Container>
                <Navbar.Brand as={Link} to="/">My Reviewish List</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {currentUser && (
                            <>
                                <Dropdown>
                                   <Dropdown.Toggle className='dropdown'>
                                        Movies
                                    </Dropdown.Toggle>
                                    {movieGenresData && (
                                        <Dropdown.Menu className='dropdaown-menu'>
                                            {movieGenresData.genres.map(i => (
                                                <Dropdown.Item key={i.id} as={NavLink} to={`/movies/${i.id}`}>
                                                    {i.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    )}
                                </Dropdown>

                                <Dropdown>
                                   <Dropdown.Toggle className='dropdown'>
                                        Tvshows
                                    </Dropdown.Toggle>
                                    {tvshowGenreData && (
                                        <Dropdown.Menu>
                                            {tvshowGenreData.genres.map(i => (
                                                <Dropdown.Item key={i.id} as={NavLink} to={`/tvshows/${i.id}`}>
                                                    {i.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    )}
                                </Dropdown>

                                <Nav.Link as={NavLink} to="/search">Search</Nav.Link>
                                <Nav.Link as={NavLink} to="/toplists">Toplists</Nav.Link>
                                <Nav.Link as={NavLink} to="/logout">Log out</Nav.Link>
                            </>
                        )}

                        {!currentUser && (
                            <>
                                <Nav.Link as={NavLink} to="/">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/signup">Sign up</Nav.Link>
                            </>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
		</Navbar>
    )
}

export default Navigation
