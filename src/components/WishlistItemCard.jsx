import useGetCollection from "../hooks/useGetCollection"
import Container from 'react-bootstrap/Container'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'

const WishlistItemCard = ({ item }) => {
    const { data: allWishes, loading: allWishesLoading } = useGetCollection('wishlist')

    const deleteFromWishlist = async (item) => {
        // delete from users wishlist-collection 
        const usersWishlistRef = doc(db, `users/${currentUser.uid}/wishlist`, item.uid)
        await deleteDoc(usersWishlistRef)

        const foundWish = allWishes.find(wish => wish.user_wishlist_uid)
        
        // delete from wishlist-collection
        const ref = doc(db, `wishlist`, foundWish.uid)
        await deleteDoc(ref)

    }

    return (
        <Container className="card-item" key={item.uid}>
            <div className="info">
                {item.image && <img src={item.image} alt='poster' width='100px'/>}
                <div className="title-and-year">
                    <h2>{item.title}</h2>
                    <p>{item.is_movie ? item.release_date : 'number of seasons?' }</p>
                    {item.genres.map((genre, index) => {
                        if (index + 1 == item.genres.length) {
                            return `${genre.name}`
                        } else {
                            return `${genre.name} - `
                        }
                    })}
                </div>
            </div>
            <div className="card-item-btns">
                <button className="btn-primary" onClick={() => deleteFromWishlist(item)}>Delete</button>
                <button className="btn-secondary">Add review</button>
            </div>
            
        </Container>
    )
}

export default WishlistItemCard
