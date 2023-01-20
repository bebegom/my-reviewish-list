import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import WishlistItemCard from "../components/WishlistItemCard"
import CreateMovieReviewForm from "../components/CreateMovieReviewForm"
import CreateTvshowReviewForm from "../components/CreateTvshowReviewForm"
import { useState } from "react"
import { Container } from "react-bootstrap"

const MyWishlistPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/wishlist`)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [showTvshowForm, setShowTvshowForm] = useState(false)
    const [clickedItem, setClickedItem] = useState(null)

    return (
        <Container>
            {loading && (<p>loading...</p>)}

            {data && (
                <>
                    <h1>My wishlist</h1>
                    <section className="grid">
                        {data.map(item => (
                            <WishlistItemCard key={item.uid} item={item} setShowMovieForm={setShowMovieForm} setShowTvshowForm={setShowTvshowForm} setClickedItem={setClickedItem} />
                        ))}
                        {showMovieForm && <CreateMovieReviewForm movie={clickedItem} showForm={setShowMovieForm } itemFromWishlistUid={clickedItem.uid} />}
                        {showTvshowForm && <CreateTvshowReviewForm tvshow={clickedItem} showForm={setShowTvshowForm} itemFromWishlistUid={clickedItem.uid} />}
                    </section>
                    
                </>
            )}
        </Container>
    )
}

export default MyWishlistPage
