import { useState, useEffect } from 'react'
import Rating from './Rating'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { baseIMG } from '../services/tmdbAPI'
import { useRef } from 'react'
import { addDoc, doc, updateDoc, collection, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {useAuthContext} from '../contexts/AuthContext'
import useGetCollection from '../hooks/useGetCollection'

const CreateTvshowReviewForm = ({ showForm, tvshow = null, review = null, itemFromWishlistUid = null }) => {
    const [myRating, setMyRating] = useState(null)
    const [loading, setLoading] = useState(false)
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')
    const { data: allWishes, loading: allWishesLoading } = useGetCollection('wishlist')
    const [favoriteSeason, setFavoriteSeason] = useState('no favorite')

    const myReviewRef = useRef()

    const titleRef = useRef()
    const genreOneRef = useRef()
    const genreTwoRef = useRef()
    const genreThreeRef = useRef()

    const {currentUser} = useAuthContext()

    useEffect(() => {
        if(review)  {
            setMyRating(review.my_rating)
            setFavoriteCharacter(review.favorite_character)
            setFavoriteSeason(review.favorite_season)
        }
    }, [])

    const submitReview = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(tvshow == null && review == null && itemFromWishlistUid == null) {
            await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
                is_movie: false,
                is_tvshow: true,
                // api_id: tvshow.id,
                name: titleRef.current.value,
                my_rating: myRating,
                my_review: myReviewRef.current.value,
                favorite_character: favoriteCharacter,
                favorite_season: favoriteSeason,
                // overview: ,
                genres: [
                        {id: 0, name: genreOneRef.current.value},
                        {id: 1, name: genreTwoRef.current.value},
                        {id: 2, name: genreThreeRef.current.value},
                    ],
                // image: ,
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
                updateDoc(ref, {uid: cred.id})

                // add doc to reviews-collection
                await addDoc(collection(db, 'reviews'), {
                    is_movie: false,
                    is_tvshow: true,
                    // api_id: tvshow.id,
                    name: titleRef.current.value,
                    my_rating: myRating,
                    my_review: myReviewRef.current.value,
                    favorite_character: favoriteCharacter,
                    favorite_season: favoriteSeason,
                    // overview: ,
                    genres: [
                            {id: 0, name: genreOneRef.current.value},
                            {id: 1, name: genreTwoRef.current.value},
                            {id: 2, name: genreThreeRef.current.value},
                        ],
                    // image: ,
                }).then((credentials) => {
                    const ref = doc(db, 'reviews', credentials.id)
                    updateDoc(ref, {
                        uid: credentials.id
                    })
                    updateDoc(ref, {
                        user_review_uid: cred.id
                    })
                })
            })
        }

        if(tvshow) {
            // add review to the user's list of reviews
            await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
                ...tvshow,
                is_movie: false,
                is_tvshow: true,
                // api_id: tvshow.id,
                // title: tvshow.name,
                // image: `${baseIMG}${tvshow.poster_path}`,
                // genres: tvshow.genres,
                // overview: tvshow.overview,
                my_rating: myRating,
                favorite_character: favoriteCharacter,
                favorite_season: favoriteSeason,
                my_review: myReviewRef.current.value
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
                updateDoc(ref, {uid: cred.id})

                // add doc to reviews-collection
                await addDoc(collection(db, 'reviews'), {
                    ...tvshow,
                    user_id: currentUser.uid,
                    user_email: currentUser.email,
                    is_movie: false,
                    is_tvshow: true,
                    // api_id: tvshow.id,
                    // title: tvshow.name,
                    // image: `${baseIMG}${tvshow.poster_path}`,
                    // genres: tvshow.genres,
                    // overview: tvshow.overview,
                    my_rating: myRating,
                    favorite_character: favoriteCharacter,
                    favorite_season: favoriteSeason,
                    my_review: myReviewRef.current.value
                }).then((credentials) => {
                    const ref = doc(db, 'reviews', credentials.id)
                    updateDoc(ref, {
                        uid: credentials.id
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
                favorite_season: favoriteSeason,
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
                my_review: myReviewRef.current.value,
                favorite_season: favoriteSeason,
            })
        }

        if (itemFromWishlistUid) {
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
            }} className='lightbox'>
            <div className='lightbox-content p-3'>
            <button onClick={() => showForm(false)} className='p-small btn-tertiary'>Go back</button>
                <h1>Create review</h1>

                {tvshow == null && review == null && (
                    <>
                        {/* <Form.Group>
                            <Form.Label>Poster</Form.Label>
                            <Form.Control type='url' placeholder='https://'/>
                        </Form.Group> */}
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} type='text' />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Genres</Form.Label>
                            <Form.Control ref={genreOneRef} type='text' />
                            <Form.Control ref={genreTwoRef} type='text' />
                            <Form.Control ref={genreThreeRef} type='text' />
                        </Form.Group>
                    </>
                    
                )}

                {tvshow && (
                    <>
                        <h2>{tvshow.name}</h2>
                        <p>{tvshow.in_production ? 'In production' : ''}</p>
                        {tvshow.genres.map(genre => (
                            <p key={genre.id}>{genre.name}</p>
                        ))}
                        <Image className='d-block' src={`${baseIMG}${tvshow.poster_path}`} alt="poster" />
                        <h3>Overview</h3>
                        <p>{tvshow.overview}</p>
                    </>
                )}
                
                {review && (
                    <>
                        <h2>{review.name}</h2>
                        {review.genres.map(genre => (
                            <p key={genre.id}>{genre.name}</p>
                        ))}
                        {review.poster_path && <Image className='d-block' src={`${baseIMG}${review.poster_path}`} alt="poster" />}
                        
                        <h3>Overview</h3>
                        <p>{review.overview}</p>
                    </>
                )}

                <Form onSubmit={submitReview}>
                    <Rating myRating={myRating} setMyRating={setMyRating} />

                    <Form.Group>
                        <Form.Label>Favorite character</Form.Label>
                        {tvshow && (
                            <Form.Select onChange={(e) => setFavoriteCharacter(e.target.value)}>
                                <option value={'no favorite'}>No favorite</option>
                               {tvshow.credits.cast.map(i => (
                                <option value={`${i.character}-${i.name}`} key={i.id}>{i.character} ({i.name})</option>
                               ))}
                            </Form.Select>
                        )}

                        {review && (
                            <Form.Control onChange={(e) => setFavoriteCharacter(e.target.value)} type='text' defaultValue={review.favorite_character} />
                        )}

                        {tvshow == null && review == null && (
                            <Form.Control onChange={(e) => setFavoriteCharacter(e.target.value)} type='text' />
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Favorite season</Form.Label>
                        {tvshow && (
                            <Form.Select onChange={(e) => setFavoriteSeason(e.target.value)}>
                                <option value={'no favorite'}>No favorite</option>
                               {[...Array(tvshow.number_of_seasons)].map((season, index) => (
                                <option value={index+1} key={index}>{index+1}</option>
                               ))}
                            </Form.Select>
                        )}

                        {review && (
                            <Form.Control onChange={(e) => setFavoriteSeason(e.target.value)} type='text' defaultValue={review.favorite_season} />
                        )}

                        {tvshow == null && review == null && (
                            <Form.Control onChange={(e) => setFavoriteSeason(e.target.value)} type='text' />
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Write something</Form.Label>
                        <Form.Control ref={myReviewRef} defaultValue={review ? review.my_review : ''} as='textarea' rows={7} />
                    </Form.Group>

                    <Button disabled={loading} type='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateTvshowReviewForm
