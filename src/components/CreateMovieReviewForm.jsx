import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { baseIMG } from '../services/tmdbAPI'
import Rating from './Rating'
import { useRef } from 'react'
import { addDoc, doc, collection, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {useAuthContext} from '../contexts/AuthContext'

const CreateMovieReviewForm = ({ showForm, movie = null }) => {
    const [myRating, setMyRating] = useState(null)
    const [loading, setLoading] = useState(false)
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const myReviewRef = useRef()

    const {currentUser} = useAuthContext()

    const submitReview = async (e) => {
        e.preventDefault()
        setLoading(true)

        // add review to the user's review-collection
        const newUserReview = await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
            is_movie: true,
            is_tvshow: false,
            api_id: movie.id,
            title: movie.title,
            image: `${baseIMG}${movie.poster_path}`,
            release_date: movie.release_date,
            genres: movie.genres,
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
                is_movie: true,
                is_tvshow: false,
                api_id: movie.id,
                title: movie.title,
                image: `${baseIMG}${movie.poster_path}`,
                release_date: movie.release_date,
                genres: movie.genres,
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

        

        // console.log(newUserReview)

        // // update review in user's list of reviews and give it reviews_uid
        // const ref = doc(db, `users/${currentUser.uid}/reviews`, newUserReview.uid)
        // updateDoc(ref, {reviews_uid: newReview.id})

        // hide component
        showForm(false)
        setLoading(false)
    }

    return (
        <div className='lightbox m-auto'>
            <div className='lightbox-content p-3'>
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

                <Form onSubmit={submitReview}>
                    <Rating myRating={myRating} setMyRating={setMyRating} />

                    <Form.Group>
                        <Form.Label>Favorite character</Form.Label>
                        {movie && (
                            <Form.Select onChange={(e) => setFavoriteCharacter(e.target.value)}>
                                <option value={'no favorite'}>No favorite</option>
                               {movie.credits.cast.map(i => (
                                <option value={`${i.character}-${i.name}`} key={i.id}>{i.character} ({i.name})</option>
                               ))}
                            </Form.Select>
                        )}

                        {!movie && (
                            <Form.Control type='text' />
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Write something</Form.Label>
                        <Form.Control ref={myReviewRef} as='textarea' rows={7} />
                    </Form.Group>

                    <Button disabled={loading} type='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateMovieReviewForm
