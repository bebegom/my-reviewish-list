import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getMovie, baseIMG } from '../services/tmdbAPI'
import Button from 'react-bootstrap/Button'
import {useAuthContext} from '../contexts/AuthContext'
import { db } from '../firebase'
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore'
import { useState } from 'react'
import CreateMovieReviewForm from '../components/CreateMovieReviewForm'
import useGetCollection from '../hooks/useGetCollection'

const MoviePage = () => {
    const {currentUser} = useAuthContext()
    const { movieId } = useParams()
    const { data, isLoading, error, isError } = useQuery(['movie', movieId], () => getMovie(movieId))
    const [showCreateMovieReviewForm, setShowCreateMovieReviewForm] = useState(false)
    const { data: allReviews, loading: allReviewsLoading } = useGetCollection('reviews')

    const reviewCount = allReviews.filter(review => review.api_id == movieId) 
    
    const addToWishlist = async () => {
        // add movie to user's wishlist-collection on firestore
        await addDoc(collection(db, `users/${currentUser.uid}/wishlist`), {
            ...data,
            is_movie: true,
            is_tvshow: false,
            // api_id: data.id,
            // title: data.title,
            // image: `${baseIMG}${data.poster_path}`,
            // overview: data.overview,
            // release_date: data.release_date,
            // genres: data.genres
        }).then(async (cred) => {
            const ref = doc(db, `users/${currentUser.uid}/wishlist`, cred.id)
            updateDoc(ref, {uid: cred.id})

            await addDoc(collection(db, 'wishlist'), {
                user_id: currentUser.uid,
                user_email: currentUser.email,
                is_movie: true,
                is_tvshow: false,
                ...data,
                // api_id: data.id,
                // title: data.title,
                // image: `${baseIMG}${data.poster_path}`,
                // overview: data.overview,
                // release_date: data.release_date,
                // genres: data.genres
            }).then((credentials) => {
                const ref = doc(db, 'wishlist', credentials.id)
                updateDoc(ref, {uid: credentials.id})
                updateDoc(ref, {user_wishlist_uid: cred.id})
            })
        })
        
    }

    // console.log(data.genres)

    return (
        <div>
            {isLoading && (<p>loading...</p>)}
            {isError && (<p>ERROR: {error.message}</p>)}
            {data && (
                <>
                    <div className='d-flex'>
                        <img className='poster-img' src={`${baseIMG}${data.poster_path}`} alt="" />
                        <div className='d-flex flex-column justify-content-between'>
                            <h1>{data.title}</h1>
                            <p>{data.release_date}</p>
                            {/* <p>
                                {data.genres.map((genre, index) => {
                                    if(index + 1 == data.genres.length) {
                                        return `${genre.name}`
                                    } else {
                                        return `${genre.name} - `
                                    }
                                })}
                            </p> */}
                            <button className='btn-primary' onClick={() => setShowCreateMovieReviewForm(true)}>Add review</button>
                            <button className='btn-secondary' onClick={addToWishlist}>Add to wishlist</button>
                        </div>
                    </div>
                    <p className='p-small'>({reviewCount.length} reviews made on Mr.L)</p>
                    <h2>Overview</h2>
                    <p>{data.overview}</p>
                    
                </>
                
            )}

            {showCreateMovieReviewForm && <CreateMovieReviewForm showForm={setShowCreateMovieReviewForm} movie={data} />}
        </div>
    )
}

export default MoviePage
