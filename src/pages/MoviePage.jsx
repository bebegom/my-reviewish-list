import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getMovie, baseIMG } from '../services/tmdbAPI'
import {useAuthContext} from '../contexts/AuthContext'
import { db } from '../firebase'
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import CreateMovieReviewForm from '../components/CreateMovieReviewForm'
import useGetCollection from '../hooks/useGetCollection'
import ErrorMessage from '../components/ErrorMessage'
import { Container } from 'react-bootstrap'
import Rating from '../components/Rating'

const MoviePage = () => {
    const {currentUser} = useAuthContext()
    const { movieId } = useParams()
    const { data, isLoading, error: dataError, isError: dataIsError } = useQuery(['movie', movieId], () => getMovie(movieId))
    const [showCreateMovieReviewForm, setShowCreateMovieReviewForm] = useState(false)
    const { data: allReviews, loading: allReviewsLoading } = useGetCollection('reviews')
    const { data: usersReviewsData, loading: usersReviewsLoading} = useGetCollection(`users/${currentUser.uid}/reviews`)
    const { data: usersWishlistData, loading: UsersWishlistLoading } = useGetCollection(`users/${currentUser.uid}/wishlist`)
    const [reviewCount, setReviewCount] = useState(null)
    const [error, setError] = useState(null)

    useEffect(()=> {
        const countArray = allReviews.filter(review => review.id == movieId) 
        setReviewCount(countArray)
    }, [allReviewsLoading])
    
    const addToWishlist = async () => {
        try {
            // add movie to user's wishlist-collection on firestore
            await addDoc(collection(db, `users/${currentUser.uid}/wishlist`), {
                ...data,
                is_movie: true,
                is_tvshow: false,
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/wishlist`, cred.id)
                updateDoc(ref, {uid: cred.id})

                // add movie to wishlist-collection
                await addDoc(collection(db, 'wishlist'), {
                    user_id: currentUser.uid,
                    user_email: currentUser.email,
                    is_movie: true,
                    is_tvshow: false,
                    ...data,
                }).then((credentials) => {
                    const ref = doc(db, 'wishlist', credentials.id)
                    updateDoc(ref, {uid: credentials.id})
                    updateDoc(ref, {user_wishlist_uid: cred.id})
                })
            })
        } catch (e) {
            setError(`Failed to add ${data.title} to your wishlist`)
        }
    }

    return (
        <Container className='my-3'>
            {isLoading && (<p>loading...</p>)}
            {dataIsError && (<p>ERROR: {dataError.message}</p>)}
            {error && (<ErrorMessage setError={setError} msg={error} />)}

            {data && (
                <>
                    <div className='d-flex poster-container'>
                        <img className='poster-detail-page' src={`${baseIMG}${data.poster_path}`} alt="" />
                        <div className='d-flex flex-column mx-2'>
                            <h1>{data.title}</h1>
                            <p>{data.release_date}</p>

                            <button disabled={usersReviewsData.find(movie => movie.id == data.id)} className='btn-primary' onClick={() => setShowCreateMovieReviewForm(true)}>{usersReviewsData.find(movie => movie.id == data.id) ? 'Already reviewed' : 'Add review'}</button>
                            <button disabled={usersWishlistData.find(movie => movie.id == data.id) || usersReviewsData.find(movie => movie.id == data.id)} className='btn-secondary' onClick={addToWishlist}>{usersWishlistData.find(movie => movie.id == data.id) ? 'Already in wishlist' : usersReviewsData.find(movie => movie.id == data.id) ? 'Already seen' : 'Add to wishlist'}</button>
                        </div>
                    </div>
                    
                    <h2>Overview</h2>
                    <p>{data.overview}</p>

                    <h2>Overview</h2>
                    {reviewCount && (
                        <>
                            <p className='p-small'>({reviewCount.length} reviews made on Mr.L)</p>

                            {reviewCount.map(i => 
                                <div key={i.uid} className='review'>
                                    <Rating myRating={i.my_rating} />
                                    <p>{i.my_review}</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {showCreateMovieReviewForm && <CreateMovieReviewForm showForm={setShowCreateMovieReviewForm} movie={data} />}
        </Container>
    )
}

export default MoviePage
