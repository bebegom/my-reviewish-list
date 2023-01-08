import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { baseIMG } from '../services/tmdbAPI'
import Rating from './Rating'
import { useRef } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import {useAuthContext} from '../contexts/AuthContext'



const CreateMovieReviewForm = ({ movie = null }) => {
    const [myRating, setMyRating] = useState(null)
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const myReviewRef = useRef()

    const {currentUser} = useAuthContext()

    const submitReview = async (e) => {
        e.preventDefault()
        console.log('submitting')
        console.log(favoriteCharacter)
        console.log(myReviewRef.current.value)

        // add review to the user's review-collection
        await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
            is_movie: true,
            is_tvshow: false,
            id: movie.id,
            title: movie.title,
            image: `${baseIMG}${movie.poster_path}`,
            release_date: movie.release_date,
            genres: movie.genres,
            my_rating: myRating,
            favorite_character: favoriteCharacter,
            my_review: myReviewRef.current.value
        })
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


                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateMovieReviewForm
