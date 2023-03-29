import Container from 'react-bootstrap/Container'

import CardLink from '../components/CardLink'
import EmptyStarIcon from '../assets/images/empty-rating.png'

const HomePage = () => {

    return (
        <Container className='three-link-cards my-3'>
            
            <CardLink endpoint='/my-reviews' icon={EmptyStarIcon} text='My reviews' />
            <CardLink endpoint='/my-wishlist' icon={EmptyStarIcon} text='My wishlist' />
            <CardLink endpoint='/shared' icon={EmptyStarIcon} text='Reviews shared with me' />
        </Container>
    )
}

export default HomePage
