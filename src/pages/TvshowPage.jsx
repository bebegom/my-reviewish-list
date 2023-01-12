import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getTvshow, baseIMG } from '../services/tmdbAPI'
import Button from 'react-bootstrap/Button'
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../contexts/AuthContext'
import { useState } from 'react'
import CreateTvshowReviewForm from '../components/CreateTvshowReviewForm'
import useGetCollection from '../hooks/useGetCollection'

const TvshowPage = () => {
    const { tvshowId } = useParams()
    const { data, isLoading, error, isError } = useQuery(['tvshow', tvshowId], () => getTvshow(tvshowId))
    const { currentUser } = useAuthContext()
    const [showCreateTvshowReviewForm, setShowCreateTvshowReviewForm] = useState()
    const { data: allReviews, loading: allReviewsLoading } = useGetCollection('reviews')

    const reviewCount = allReviews.filter(review => review.api_id == tvshowId) 
    console.log(reviewCount)

    const addToWishlist = async () => {
        // add tvshow to user's wishlist-collection on firestore
        await addDoc(collection(db, `users/${currentUser.uid}/wishlist`), {
            is_movie: false,
            is_tvshow: true,
            api_id: data.id,
            title: data.name,
            image: `${baseIMG}${data.poster_path}`,
            genres: data.genres,
            overview: data.overview,
            number_of_seasons: data.number_of_seasons
        }).then(async (cred) => {
            const ref = doc(db, `users/${currentUser.uid}/wishlist`, cred.id)
            updateDoc(ref, {uid: cred.id})

            await addDoc(collection(db, 'wishlist'), {
                user_id: currentUser.uid,
                user_email: currentUser.email,
                is_movie: false,
                is_tvshow: true,
                api_id: data.id,
                title: data.name,
                image: `${baseIMG}${data.poster_path}`,
                genres: data.genres,
                overview: data.overview,
                number_of_seasons: data.number_of_seasons
            }).then((credentials) => {
                const ref = doc(db, 'wishlist', credentials.id)
                updateDoc(ref, {uid: credentials.id})
                updateDoc(ref, {user_wishlist_uid: cred.id})
            })
        })
    }

    return (
        <div>
            {isLoading && (<p>loading...</p>)}
            {isError && (<p>ERROR: {error.message}</p>)}
            {data && (
                <>
                    <p>
                        This tvshow: {data.name} ({reviewCount.length} reviews made on Mr.L)
                    </p>
                        <Button onClick={() => setShowCreateTvshowReviewForm(true)}>Add review</Button>
                        <Button onClick={addToWishlist}>Add to wishlist</Button>
                </>
            )}

            {showCreateTvshowReviewForm && <CreateTvshowReviewForm showForm={setShowCreateTvshowReviewForm} tvshow={data} />}
        </div>
    )
}

export default TvshowPage
