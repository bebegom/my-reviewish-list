import { useState, useEffect } from 'react'
import Rating from './Rating'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { baseIMG } from '../services/tmdbAPI'
import { useRef } from 'react'
import { addDoc, doc, updateDoc, collection, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {useAuthContext} from '../contexts/AuthContext'
import useGetCollection from '../hooks/useGetCollection'

const CreateTvshowReviewForm = ({ showForm, tvshow = null, review = null }) => {
    const [myRating, setMyRating] = useState(null)
    const [loading, setLoading] = useState(false)
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')
    const [favoriteSeason, setFavoriteSeason] = useState('no favorite')

    const myReviewRef = useRef()

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

        if(tvshow) {
            // add review to the user's list of reviews
            await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
                is_movie: false,
                is_tvshow: true,
                api_id: tvshow.id,
                title: tvshow.name,
                image: `${baseIMG}${tvshow.poster_path}`,
                genres: tvshow.genres,
                overview: tvshow.overview,
                my_rating: myRating,
                favorite_character: favoriteCharacter,
                favorite_season: favoriteSeason,
                my_review: myReviewRef.current.value
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
                updateDoc(ref, {uid: cred.id})

                // add doc to reviews-collection
                await addDoc(collection(db, 'reviews'), {
                    user_id: currentUser.uid,
                    user_email: currentUser.email,
                    is_movie: false,
                    is_tvshow: true,
                    api_id: tvshow.id,
                    title: tvshow.name,
                    image: `${baseIMG}${tvshow.poster_path}`,
                    genres: tvshow.genres,
                    overview: tvshow.overview,
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
            }} className='lightbox'>
            <div className='lightbox-content p-3'>
            <button onClick={() => showForm(false)} className='p-small btn-tertiary'>Go back</button>
                <h1>create review</h1>

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
                        <h2>{review.title}</h2>
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
