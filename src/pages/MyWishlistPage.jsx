import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import WishlistItemCard from "../components/WishlistItemCard"
import CreateMovieReviewForm from "../components/CreateMovieReviewForm"
import CreateTvshowReviewForm from "../components/CreateTvshowReviewForm"
import { useState } from "react"

const MyWishlistPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/wishlist`)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [showTvshowForm, setShowTvshowForm] = useState(false)
    const [clickedItem, setClickedItem] = useState(null)

    return (
        <>
            {loading && (<p>loading...</p>)}

            {data && (
                <>
                    <p>We have your list</p>
                    {data.map(item => (
                        <WishlistItemCard key={item.uid} item={item} setShowMovieForm={setShowMovieForm} setShowTvshowForm={setShowTvshowForm} setClickedItem={setClickedItem} />
                    ))}
                    {showMovieForm && <CreateMovieReviewForm movie={clickedItem} showForm={setShowMovieForm } itemFromWishlistUid={clickedItem.uid} />}
                    {showTvshowForm && <CreateTvshowReviewForm tvshow={clickedItem} showForm={setShowTvshowForm} itemFromWishlistUid={clickedItem.uid} />}
                </>
            )}
        </>
    )
}

export default MyWishlistPage
