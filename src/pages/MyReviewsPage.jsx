import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import ReviewItemCard from "../components/ReviewItemCard"
import CreateMovieReviewForm from "../components/CreateMovieReviewForm"
import CreateTvshowReviewForm from "../components/CreateTvshowReviewForm"
import { useState } from "react"

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [showTvshowForm, setShowTvshowForm] = useState(false)


    return (
        <>
            {loading && <p>loading...</p>}

            {data && (
                <>
                    <h1>My reviews</h1>
                    <button onClick={() => setShowMovieForm(true)} className="btn-primary">Create new movie-review</button>
                    <button onClick={() => setShowTvshowForm(true)} className="btn-primary">Create new tvshow-review</button>
                    {data.map(item => (
                        <ReviewItemCard item={item} key={item.id} />
                    ))}
                </>
            )}

            {showMovieForm && <CreateMovieReviewForm showForm={setShowMovieForm} />}
            {showTvshowForm && <CreateTvshowReviewForm showForm={setShowTvshowForm} />}
        </>
    )
}

export default MyReviewsPage
