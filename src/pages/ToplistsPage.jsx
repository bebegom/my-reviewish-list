import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import CardLink from '../components/CardLink'

const ToplistsPage = () => {
    
    return (
        <Container className='my-3'>
            <h1>Toplists</h1>
            <Container className='three-link-cards'>
                <CardLink text={'Most watched'} endpoint={'/toplists/most-watched'} />
                <CardLink text={'Most wanted'} endpoint={'/toplists/most-wanted'} />
                <CardLink text={'Most active user'} endpoint={'/toplists/most-active-user'} />
            </Container>
        </Container>
    )
}

export default ToplistsPage
