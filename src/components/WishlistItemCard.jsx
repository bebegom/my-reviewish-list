import useGetCollection from "../hooks/useGetCollection"
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from "../contexts/AuthContext"
import { baseIMG } from "../services/tmdbAPI"


const WishlistItemCard = ({ item, setShowMovieForm, setShowTvshowForm, setClickedItem }) => {
    const { data: allWishes, loading: allWishesLoading } = useGetCollection('wishlist')
    const { currentUser } = useAuthContext()

    // TODO: create funtion 
    const addReview = (item) => {
        setClickedItem(item)

        // set showForm to true
        if(item.is_movie) {
            setShowMovieForm(true)
        } else {
            setShowTvshowForm(true)
        }
        
    }

    const deleteFromWishlist = async (item) => {
        // delete from users wishlist-collection 
        const usersWishlistRef = doc(db, `users/${currentUser.uid}/wishlist`, item.uid)
        await deleteDoc(usersWishlistRef)

        const foundWish = allWishes.find(wish => wish.user_wishlist_uid == item.uid)
        
        // delete from wishlist-collection
        const ref = doc(db, `wishlist`, foundWish.uid)
        await deleteDoc(ref)

    }

    // useEffect(()=> {
    //     // delete from wishlist
    //     deleteFromWishlist(item)
    // }, [submit])

    return (
        <div className="wishlist-card-item" key={item.uid}>
            <div className="wishlist-card-item-info">
                {item.poster_path && <img src={`${baseIMG}${item.poster_path}`} alt='poster' width='100px'/>}
                <div className="wishlist-card-item-title-and-year">
                    <h2>{item.is_movie ? item.title : item.name}</h2>
                    <p>{item.is_movie ? item.release_date : item.number_of_seasons }</p>
                    {/* <p className="p-small">
                    {item.genres.map((genre, index) => {
                        if (index + 1 == item.genres.length) {
                            return `${genre.name}`
                        } else {
                            return `${genre.name} - `
                        }
                    })}
                    </p> */}
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
