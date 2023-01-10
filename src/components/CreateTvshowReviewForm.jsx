import { useState } from 'react'
import Rating from './Rating'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { baseIMG } from '../services/tmdbAPI'
import { useRef } from 'react'
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import {useAuthContext} from '../contexts/AuthContext'

const CreateTvshowReviewForm = ({ showForm, tvshow = null }) => {
    const [myRating, setMyRating] = useState(null)
    const [loading, setLoading] = useState(false)
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const [favoriteSeason, setFavoriteSeason] = useState('no favorite')

    const myReviewRef = useRef()

    const {currentUser} = useAuthContext()

    console.log(tvshow.number_of_seasons)

    const submitReview = async (e) => {
        e.preventDefault()
        setLoading(true)

        // add review to the user's list of reviews
        await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
            is_movie: false,
            is_tvshow: true,
            api_id: tvshow.id,
            title: tvshow.name,
            image: `${baseIMG}${tvshow.poster_path}`,
            my_rating: myRating,
            favorite_character: favoriteCharacter,
            favorite_season: favoriteSeason,
            my_review: myReviewRef.current.value
        }).then((cred) => {
            const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
            updateDoc(ref, {uid: cred.id})
        })

        // add doc to reviews-collection
        await addDoc(collection(db, 'reviews'), {
            user_id: currentUser.uid,
            user_email: currentUser.email,
            is_movie: false,
            is_tvshow: true,
            api_id: tvshow.id,
            title: tvshow.name,
            image: `${baseIMG}${tvshow.poster_path}`,
            my_rating: myRating,
            favorite_character: favoriteCharacter,
            favorite_season: favoriteSeason,
            my_review: myReviewRef.current.value
        }).then((cred) => {
            const ref = doc(db, 'reviews', cred.id)
            updateDoc(ref, {uid: cred.id})
        })

        // hide component
        showForm(false)
        setLoading(false)
    }

    return (
        <div className='lightbox m-auto'>
            <div className='lightbox-content p-3'>
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

                        {!tvshow && (
                            <Form.Control type='text' />
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

                        {!tvshow && (
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

export default CreateTvshowReviewForm
