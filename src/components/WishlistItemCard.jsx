import useGetCollection from "../hooks/useGetCollection"
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'

const WishlistItemCard = ({ item }) => {
    const { data: allWishes, loading: allWishesLoading } = useGetCollection('wishlist')

    // TODO: create funtion 
    const addReview = (item) => {
        // set showForm to true

        // delete from wishlist
    }

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
        <div className="wishlist-card-item" key={item.uid}>
            <div className="wishlist-card-item-info">
                {item.image && <img src={item.image} alt='poster' width='100px'/>}
                <div className="wishlist-card-item-title-and-year">
                    <h2>{item.title}</h2>
                    <p>{item.is_movie ? item.release_date : 'number of seasons?' }</p>
                    <p className="p-small">
                    {item.genres.map((genre, index) => {
                        if (index + 1 == item.genres.length) {
                            return `${genre.name}`
                        } else {
                            return `${genre.name} - `
                        }
                    })}
                    </p>
                </div>
            </div>
            <div className="card-item-btns">
                <button className="btn-primary" onClick={() => deleteFromWishlist(item)}>Delete</button>

                <button onClick={() => addReview(item)} className="btn-secondary">Add review</button>
            </div>
            
        </div>
    )
}

export default WishlistItemCard
