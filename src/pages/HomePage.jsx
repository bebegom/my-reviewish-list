import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

const HomePage = () => {
    const {currentUser} = useAuthContext()
    return (
        <Container>
            <h1>Homepage</h1>
            <p>Current user: {currentUser ? currentUser.email : 'null'}</p>

            <Button as={Link} to='/my-reviews'>My reviews</Button>
            <Button as={Link} to='/my-wishlist'>My wish-list</Button>
            <Button as={Link} to='/shared'>Reviews shared with me</Button>
        </Container>
    )
}

export default HomePage
