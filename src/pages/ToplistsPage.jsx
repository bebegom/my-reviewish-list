import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

const ToplistsPage = () => {
    return (
        <Container>
            <h1>Toplists</h1>
            <Button as={Link} to={'/toplists/most-watched'}>Most watched</Button>
            <Button as={Link} to={'/toplists/most-wanted'}>Most wanted</Button>
            <Button as={Link} to={'/toplists/most-active-user'}>Most active user</Button>
        </Container>
    )
}

export default ToplistsPage
