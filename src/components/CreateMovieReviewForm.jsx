import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { baseIMG } from '../services/tmdbAPI'
import Rating from './Rating'
import { useRef } from 'react'
import { addDoc, doc, collection, updateDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../contexts/AuthContext'
import { useEffect } from 'react'
import useGetCollection from '../hooks/useGetCollection'

const CreateMovieReviewForm = ({ showForm, movie = null, review = null, setSubmit = null, itemFromWishlistUid = null}) => {
    const [myRating, setMyRating] = useState(null)
    const [loading, setLoading] = useState(false)
    const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')
    const { data: allWishes, loading: allWishesLoading } = useGetCollection('wishlist')
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const myReviewRef = useRef()

    const {currentUser} = useAuthContext()

    useEffect(() => {
        if(review)  {
            setMyRating(review.my_rating)
            setFavoriteCharacter(review.favorite_character)
        }
    }, [])

    const submitReview = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(movie) {
            // add review to the user's review-collection
            await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
                ...movie,
                is_movie: true,
                is_tvshow: false,
                // api_id: movie.id,
                // title: movie.title,
                // image: `${baseIMG}${movie.poster_path}`,
                // release_date: movie.release_date,
                // genres: movie.genres,
                // overview: movie.overview,
                my_rating: myRating,
                favorite_character: favoriteCharacter,
                my_review: myReviewRef.current.value
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
                updateDoc(ref, {uid: cred.id})

                // add doc to reviews-collection
                await addDoc(collection(db, 'reviews'), {
                    user_id: currentUser.uid,
                    user_email: currentUser.email,
                    ...movie,
                is_movie: true,
                is_tvshow: false,
                // api_id: movie.id,
                // title: movie.title,
                // image: `${baseIMG}${movie.poster_path}`,
                // release_date: movie.release_date,
                // genres: movie.genres,
                // overview: movie.overview,
                my_rating: myRating,
                favorite_character: favoriteCharacter,
                my_review: myReviewRef.current.value
                }).then((credentials) => {
                    const ref = doc(db, 'reviews', credentials.id)
                    updateDoc(ref, {
                        uid: credentials.id, 
                    })
                    updateDoc(ref, {
                        user_review_uid: cred.id
                    })
                })
            })
        }

        if(review) {
            // update doc in user's reviews-collection
            const ref = doc(db, `users/${currentUser.uid}/reviews`, review.uid)
            setDoc(ref, { 
                ...review, 
                my_rating: myRating, 
                favorite_character: favoriteCharacter, 
                my_review: myReviewRef.current.value
            })

            // find review in reviews-collection
            const foundReview = allReviews.find(rev => rev.user_review_uid == review.uid)

            // update doc in reviews-collection
            const ref2 = doc(db, `reviews`, foundReview.uid)
            setDoc(ref2, { 
                ...review, 
                uid: foundReview.uid, 
                user_review_uid: foundReview.user_review_uid, 
                my_rating: myRating, 
                favorite_character: favoriteCharacter, 
                my_review: myReviewRef.current.value
            })
        }

        if (itemFromWishlistUid) {
            // delete from wishlist
            // delete from users wishlist-collection 
            const usersWishlistRef = doc(db, `users/${currentUser.uid}/wishlist`, itemFromWishlistUid)
            await deleteDoc(usersWishlistRef)

            const foundWish = allWishes.find(wish => wish.user_wishlist_uid == itemFromWishlistUid)
            
            // delete from wishlist-collection
            const ref = doc(db, `wishlist`, foundWish.uid)
            await deleteDoc(ref)
        }

        // hide component
        showForm(false)
        setLoading(false)
    }

    return (
        <div onClick={(e) => {
            if(e.target.classList.contains('lightbox')) {
                showForm(false)
            }
            console.log(e.target)
            }} className='lightbox m-auto'>
            <div className='lightbox-content p-3'>
                <button onClick={() => showForm(false)} className='p-small btn-tertiary'>Go back</button>
                <h1>create review</h1>

                {movie && (
                    <>
                        <h2>{movie.title}</h2>
                        <p>{movie.release_date}</p>
                        {movie.genres.map(genre => (
                            <p key={genre.id}>{genre.name}</p>
                        ))}
                        <Image className='d-block' src={`${baseIMG}${movie.poster_path}`} alt="poster" />
                        <h3>Overview</h3>
                        <p>{movie.overview}</p>
                    </>
                )}

                {review && (
                    <>
                        <h2>{review.title}</h2>
                        <p>{review.release_date}</p>
                        {review.genres.map(genre => (
                            <p key={genre.id}>{genre.name}</p>
                        ))}
                        <Image className='d-block' src={`${baseIMG}${review.image}`} alt="poster" />
                        <h3>Overview</h3>
                        <p>{review.overview}</p>
                    </>
                )}

                <Form onSubmit={submitReview}>
                    <Rating myRating={myRating} setMyRating={setMyRating} />

                    <Form.Group>
                        <Form.Label>Favorite character</Form.Label>
                        {movie && (
                            <Form.Select onChange={(e) => setFavoriteCharacter(e.target.value)}>
                                <option value={'no favorite'}>No favorite</option>
                               {movie.credits.cast.map(i => (
                                <option value={`${i.character} (${i.name})`} key={i.id}>{i.character} ({i.name})</option>
                               ))}
                            </Form.Select>
                        )}

                        {review && (
                            <Form.Control onChange={(e) => setFavoriteCharacter(e.target.value)} type='text' defaultValue={review.favorite_character} />
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Write something</Form.Label>
                        <Form.Control ref={myReviewRef} as='textarea' rows={7} defaultValue={review ? review.my_review : ''} />
                    </Form.Group>

                    <Button disabled={loading} type='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateMovieReviewForm
