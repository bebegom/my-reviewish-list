import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getMovie, baseIMG } from '../services/tmdbAPI'
import Button from 'react-bootstrap/Button'
import {useAuthContext} from '../contexts/AuthContext'
import { db } from '../firebase'
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore'
import { useState } from 'react'
import CreateMovieReviewForm from '../components/CreateMovieReviewForm'

const MoviePage = () => {
    const { movieId } = useParams()
    const { data, isLoading, error, isError } = useQuery(['movie', movieId], () => getMovie(movieId))
    const [showCreateMovieReviewForm, setShowCreateMovieReviewForm] = useState(false)
    
    const {currentUser} = useAuthContext()

    const addToWishlist = async () => {
        // add movie to user's wishlist-collection on firestore
        await addDoc(collection(db, `users/${currentUser.uid}/wishlist`), {
            is_movie: true,
            is_tvshow: false,
            api_id: data.id,
            title: data.title,
            image: `${baseIMG}${data.poster_path}`,
            release_date: data.release_date,
            genres: data.genres
        }).then((cred) => {
            const ref = doc(db, `users/${currentUser.uid}/wishlist`, cred.id)
            updateDoc(ref, {uid: cred.id})
        })

        await addDoc(collection(db, 'wishlist'), {
            user_id: currentUser.uid,
            user_email: currentUser.email,
            is_movie: true,
            is_tvshow: false,
            api_id: data.id,
            title: data.title,
            image: `${baseIMG}${data.poster_path}`,
            release_date: data.release_date,
            genres: data.genres
        }).then((cred) => {
            const ref = doc(db, 'wishlist', cred.id)
            updateDoc(ref, {uid: cred.id})
        })
    }

    return (
        <div>
            {isLoading && (<p>loading...</p>)}
            {isError && (<p>ERROR: {error.message}</p>)}
            {data && (
                <p>
                    This movie: {data.title}
                    <Button onClick={() => setShowCreateMovieReviewForm(true)}>Add review</Button>
                    <Button onClick={addToWishlist}>Add to wishlist</Button>
                </p>
            )}

            {showCreateMovieReviewForm && <CreateMovieReviewForm showForm={setShowCreateMovieReviewForm} movie={data} />}
        </div>
    )
}

export default MoviePage
