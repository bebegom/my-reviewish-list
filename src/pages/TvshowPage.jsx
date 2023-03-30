import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getTvshow, baseIMG } from '../services/tmdbAPI'
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import CreateTvshowReviewForm from '../components/CreateTvshowReviewForm'
import Rating from '../components/Rating'
import useGetCollection from '../hooks/useGetCollection'
import ErrorMessage from '../components/ErrorMessage'
import { Container } from 'react-bootstrap'

const TvshowPage = () => {
    const { tvshowId } = useParams()
    const { data, isLoading, error, isError } = useQuery(['tvshow', tvshowId], () => getTvshow(tvshowId))
    const { currentUser } = useAuthContext()
    const [showCreateTvshowReviewForm, setShowCreateTvshowReviewForm] = useState()
    const { data: allReviews, loading: allReviewsLoading } = useGetCollection('reviews')
    const { data: usersReviewsData, loading: usersReviewsLoading} = useGetCollection(`users/${currentUser.uid}/reviews`)
    const { data: usersWishlistData, loading: UsersWishlistLoading } = useGetCollection(`users/${currentUser.uid}/wishlist`)
    const [reviewCount, setReviewCount] = useState(null)
    const [errorOccurred, setErrorOccurred] = useState(null)

    useEffect(()=> {
        const countArray = allReviews.filter(review => review.id == tvshowId) 
        setReviewCount(countArray)
    }, [allReviewsLoading])

    const addToWishlist = async () => {
        try {
            // add tvshow to user's wishlist-collection on firestore
            await addDoc(collection(db, `users/${currentUser.uid}/wishlist`), {
                is_movie: false,
                is_tvshow: true,
                ...data,
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/wishlist`, cred.id)
                updateDoc(ref, {uid: cred.id})

                await addDoc(collection(db, 'wishlist'), {
                    user_id: currentUser.uid,
                    user_email: currentUser.email,
                    is_movie: false,
                    is_tvshow: true,
                    ...data,
                }).then((credentials) => {
                    const ref = doc(db, 'wishlist', credentials.id)
                    updateDoc(ref, {uid: credentials.id})
                    updateDoc(ref, {user_wishlist_uid: cred.id})
                })
            })
        } catch (e) {
            setErrorOccurred(`Failed to add ${data.name} to your wishlist`)
        }
        
    }

    return (
        <Container className='my-3'>
            {isLoading && (<p>loading...</p>)}
            {isError && (<p>ERROR: {error.message}</p>)}
            {errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
            {data && (
                <>
                    <div className='d-flex poster-container'>
                        <img className='poster-detail-page' src={`${baseIMG}${data.poster_path}`} alt="" />
                        <div className='d-flex- flex-column mx-2'>
                            <h1>{data.name}</h1>
                            <p>{data.number_of_seasons} seasons</p>
                            <button disabled={usersReviewsData.find(movie => movie.id == data.id)} className='btn-primary' onClick={() => setShowCreateTvshowReviewForm(true)}>{usersReviewsData.find(movie => movie.id == data.id) ? 'Already reviewed' : 'Add review'}</button>
                            <button disabled={usersWishlistData.find(movie => movie.id == data.id) || usersReviewsData.find(movie => movie.id == data.id)} className='btn-secondary' onClick={addToWishlist}>{usersWishlistData.find(movie => movie.id == data.id) ? 'Already in wishlist' : usersReviewsData.find(movie => movie.id == data.id) ? 'Already seen' : 'Add to wishlist'}</button>
                        </div>
                    </div>
                   
                    <h2>Overview</h2>
                    <p>{data.overview}</p>
                    <h2>Reviews</h2>
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

            {showCreateTvshowReviewForm && <CreateTvshowReviewForm showForm={setShowCreateTvshowReviewForm} tvshow={data} />}
        </Container>
    )
}

export default TvshowPage
