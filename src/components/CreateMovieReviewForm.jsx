import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import { useQuery } from 'react-query'
import { baseIMG, getMovieGenres } from '../services/tmdbAPI'
import Rating from './Rating'


const CreateMovieReviewForm = ({ movie = null }) => {
    // const [chosenGenres, setChosenGenres] = useState([])
    const [myRating, setMyRating] = useState(null)

    const submitReview = (e) => {
        e.preventDefault()
        console.log('submitting')
    }

    const { data: genres, isLoading, isError, error } = useQuery(["genres to form"], getMovieGenres)

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

                    {/* <Form.Group id='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control defaultValue={movie ? movie.title : ''} type='text' required />
                    </Form.Group> */}

                    {/* {movie && (<Image className='d-block' src={`${baseIMG}${movie.poster_path}`} alt="poster" />)} */}

                    {/* <Form.Group>
                        
                    </Form.Group> */}

                    {/* {!movie && (
                        <Form.Group>
                            <Form.Label>Select img</Form.Label>
                            <Form.Control type='file'></Form.Control>
                        </Form.Group>
                    )} */}

                    {/* <Form.Group id='genres'>
                        <Form.Label>Genres</Form.Label>
                        {movie && (
                            <>
                                {movie.genres.map(genre => (
                                    <Form.Control readOnly defaultValue={genre.name} key={genre.id} type='text' />
                                ))}

                                {!movie && (
                                    <>
                                        <Form.Control type='text' />
                                        <Form.Control type='text' />
                                        <Form.Control type='text' />
                                        <Form.Control type='text' />
                                    </>
                                )}
                            </>
                        )}
                    </Form.Group> */}

                    {/* <Form.Group>
                        <Form.Label>Overview</Form.Label>
                        <Form.Control readOnly={movie} defaultValue={movie ? movie.overview : ''} />
                    </Form.Group> */}

                    <Rating myRating={myRating} setMyRating={setMyRating} />

                    

                    <Form.Group>
                        <Form.Label>Favorite character</Form.Label>
                        {movie && (
                            <Form.Select>
                               {movie.credits.cast.map(i => (
                                <option key={i.id}>{i.character} ({i.name})</option>
                               ))}
                            </Form.Select>
                        )}

                        {!movie && (
                            <Form.Control type='text' />
                        )}
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Write something</Form.Label>
                        <Form.Control as='textarea' rows={7} />
                    </Form.Group>


                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateMovieReviewForm
