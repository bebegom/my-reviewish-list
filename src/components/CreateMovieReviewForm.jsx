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
import ErrorMessage from './ErrorMessage'

const CreateMovieReviewForm = ({ showForm, movie = null, review = null, itemFromWishlistUid = null}) => {
    const {currentUser} = useAuthContext()
    const [myRating, setMyRating] = useState(null)
    const [loading, setLoading] = useState(false)
    const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')
    const {data: allUsersFolders, loading: allUsersFoldersLoading} = useGetCollection(`users/${currentUser.uid}/folders`)
    const { data: allWishes, loading: allWishesLoading } = useGetCollection('wishlist')
    const {data: usersWishlist, loading: usersWishlistLoading} = useGetCollection(`users/${currentUser.uid}/wishlist`)
    const [favoriteCharacter, setFavoriteCharacter] = useState('no favorite')
    const myReviewRef = useRef()
    const [errorOccurred, setErrorOccurred] = useState(null)

    const titleRef = useRef()
    const genreOneRef = useRef()
    const genreTwoRef = useRef()
    const genreThreeRef = useRef()

    const [chosenFolder, setChosenFolder] = useState(null)

    useEffect(() => {
        if(review)  {
            setMyRating(review.my_rating)
            setFavoriteCharacter(review.favorite_character)

            if(review.folder) {
                setChosenFolder(review.folder)
            }
        }
    }, [])

    const submitReview = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(myRating == null) {
            setErrorOccurred("You didn't give the movie a rating")
            setLoading(false)
            return
        }

        if(movie == null && review == null && itemFromWishlistUid == null) {
            if (titleRef.current.value == '') {
                setErrorOccurred("You need to give the movie a title")
                setLoading(false)
                return
            }

            try {
                await addDoc(collection( db, `users/${currentUser.uid}/reviews`), {
                    is_movie: true,
                    is_tvshow: false,
                    title: titleRef.current.value,
                    my_rating: myRating,
                    my_review: myReviewRef.current.value,
                    favorite_character: favoriteCharacter,
                    genres: [
                        {id: 0, name: genreOneRef.current.value},
                        {id: 1, name: genreTwoRef.current.value},
                        {id: 2, name: genreThreeRef.current.value},
                    ],
                    folder: chosenFolder,
                }).then(async (cred) => {
                    const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
                    updateDoc(ref, {uid: cred.id})

                    try {
                        // add doc to reviews-collection
                        await addDoc(collection(db, 'reviews'), {
                            user_id: currentUser.uid,
                            user_email: currentUser.email,
                            is_movie: true,
                            is_tvshow: false,
                            title: titleRef.current.value,
                            my_rating: myRating,
                            my_review: myReviewRef.current.value,
                            favorite_character: favoriteCharacter,
                            genres: [
                                {id: 0, name: genreOneRef.current.value},
                                {id: 1, name: genreTwoRef.current.value},
                                {id: 2, name: genreThreeRef.current.value},
                            ],
                            folder: chosenFolder,
                        }).then((credentials) => {
                            const ref = doc(db, 'reviews', credentials.id)
                            updateDoc(ref, {
                                uid: credentials.id, 
                            })
                            updateDoc(ref, {
                                user_review_uid: cred.id
                            })
                        })
                    } catch (e) {
                        setErrorOccurred("Couldn't create your review")
                    }
                })
            } catch (e) {
                setErrorOccurred("Couldn't create your review")
            }
        }

        if(movie) {
            try {
                // add review to the user's review-collection
                await addDoc(collection(db, `users/${currentUser.uid}/reviews`), {
                    ...movie,
                    is_movie: true,
                    is_tvshow: false,
                    api_id: movie.id,
                    my_rating: myRating,
                    favorite_character: favoriteCharacter,
                    my_review: myReviewRef.current.value,
                    folder: chosenFolder,
                }).then(async (cred) => {
                    const ref = doc(db, `users/${currentUser.uid}/reviews`, cred.id)
                    updateDoc(ref, {uid: cred.id})

                    try {
                        // add doc to reviews-collection
                        await addDoc(collection(db, 'reviews'), {
                            user_id: currentUser.uid,
                            user_email: currentUser.email,
                            ...movie,
                            is_movie: true,
                            is_tvshow: false,
                            my_rating: myRating,
                            favorite_character: favoriteCharacter,
                            my_review: myReviewRef.current.value,
                            folder: chosenFolder,
                        }).then((credentials) => {
                            const ref = doc(db, 'reviews', credentials.id)
                            updateDoc(ref, {
                                uid: credentials.id, 
                            })
                            updateDoc(ref, {
                                user_review_uid: cred.id
                            })
                        })
                    } catch (e) {
                        setErrorOccurred("Couldn't create your review")
                    }
                })

                // check if movie exists in user's wishlist and if so - delete it
                const foundInWishlist = usersWishlist.find(i => i.id == movie.id)
                if (foundInWishlist) {
                    try {
                        // delete from users wishlist-collection 
                        const usersWishlistRef = doc(db, `users/${currentUser.uid}/wishlist`, foundInWishlist.uid)
                        await deleteDoc(usersWishlistRef)
        
                        const foundWish = allWishes.find(wish => wish.user_wishlist_uid == foundInWishlist.uid)
                        
                        // delete from wishlist-collection
                        const ref = doc(db, `wishlist`, foundWish.uid)
                        await deleteDoc(ref)
                    } catch (e) {
                        setErrorOccurred("The movie didn't get removed from your wishlist while creating your review")
                    }
                }
            } catch (e) {
                setErrorOccurred("Couldn't create your review")
            }
        }

        if(review) {
            // update doc in user's reviews-collection
            const ref = doc(db, `users/${currentUser.uid}/reviews`, review.uid)
            setDoc(ref, { 
                ...review, 
                my_rating: myRating, 
                favorite_character: favoriteCharacter, 
                my_review: myReviewRef.current.value,
                folder: chosenFolder,
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
                folder: chosenFolder,
            })
        }

        if (itemFromWishlistUid) {
            try {
                // delete from users wishlist-collection 
                const usersWishlistRef = doc(db, `users/${currentUser.uid}/wishlist`, itemFromWishlistUid)
                await deleteDoc(usersWishlistRef)

                const foundWish = allWishes.find(wish => wish.user_wishlist_uid == itemFromWishlistUid)
                
                // delete from wishlist-collection
                const ref = doc(db, `wishlist`, foundWish.uid)
                await deleteDoc(ref)
            } catch (e) {
                setErrorOccurred("The movie didn't get removed from your wishlist while creating your review")
            }
        }

        // hide component
        showForm(false)
        setLoading(false)
    }

    return (
        <> 
            {!allReviewsLoading && !allUsersFoldersLoading && !allWishesLoading && !usersWishlistLoading && (
                <div onClick={(e) => {
                    if(e.target.classList.contains('lightbox')) {
                        showForm(false)
                    }
                    }} className='lightbox m-auto'>
                        {errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
                    <div className='lightbox-content p-3'>
                        <button onClick={() => showForm(false)} className='p-small btn-tertiary'>Go back</button>
                        <h1>Create review</h1>
        
                        {movie == null && review == null && (
                            <>
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
        
                        {movie && (
                            <>
                                <h2>{movie.title}</h2>
                                <p>{movie.release_date}</p>
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
                                {review.poster_path && <Image className='d-block' src={`${baseIMG}${review.poster_path}`} alt="poster" />}
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
        
                                {movie == null && review == null && (
                                    <Form.Control onChange={(e) => setFavoriteCharacter(e.target.value)} type='text' />
                                )}
                            </Form.Group>
        
                            <Form.Group>
                                <Form.Label>Write something</Form.Label>
                                <Form.Control ref={myReviewRef} as='textarea' rows={7} defaultValue={review ? review.my_review : ''} />
                            </Form.Group>
        
                            <Form.Group>
                                <Form.Label>Choose a folder</Form.Label>
                                {allUsersFolders && (
                                    <>
                                        <Form.Check 
                                            className={`folder-radio p-2 ${chosenFolder == null ? 'folder-radio-checked' : ''}`}
                                            type={'radio'} 
                                            key={'nofolder'} 
                                            label={'no folder'} 
                                            id={'nofolder'} 
                                            name={'folder'} 
                                            onChange={() => (
                                                setChosenFolder(null)
                                            )}
                                            checked={chosenFolder == null ? true : false}
                                        />
                                        {allUsersFolders.map(folder => (
                                            <Form.Check 
                                            className={`folder-radio p-2 ${chosenFolder == folder ? 'folder-radio-checked' : ''}`}
                                                type={'radio'} 
                                                key={folder.uid} 
                                                label={folder.name} 
                                                id={folder.name} 
                                                name={'folder'} 
                                                onChange={() => (
                                                    setChosenFolder(folder)
                                                )}
                                                checked={chosenFolder == folder ? true : false}
                                            />
                                        ))}
                                    </>
                                )}
                            </Form.Group>
        
                            <Button disabled={loading || errorOccurred} type='submit'>Submit</Button>
                        </Form>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateMovieReviewForm
