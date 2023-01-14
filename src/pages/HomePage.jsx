import Container from 'react-bootstrap/Container'
import { useAuthContext } from '../contexts/AuthContext'
import CardLink from '../components/CardLink'
import EmptyStarIcon from '../assets/images/empty-rating.png'

const HomePage = () => {
    const {currentUser} = useAuthContext()

    return (
        <Container>
            <p>Current user: {currentUser ? currentUser.email : 'null'}</p>

            <CardLink endpoint='/my-reviews' icon={EmptyStarIcon} text='My reviews' />

            <CardLink endpoint='/my-wishlist' icon={EmptyStarIcon} text='My wishlist' />

            <CardLink endpoint='/shared' icon={EmptyStarIcon} text='Reviews shared with me' />
        </Container>
    )
}

export default HomePage
