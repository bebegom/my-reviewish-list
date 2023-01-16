import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useQuery } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { baseIMG, getMovie } from '../services/tmdbAPI'
import CreateMovieReviewForm from './CreateMovieReviewForm'

const MovieCard = ({ movie }) => {
    const { movieGenreId } = useParams()
    const navigate = useNavigate()
    const [showCreateReviewForm, setShowCreateReviewForm] = useState()
    const {data, isLoading, error, isError} = useQuery(['movie', movie.id], () => getMovie(movie.id))

    return (
        <>
            <div onClick={(e) => {
                if(e.target.tagName != "BUTTON") {
                    return navigate(`/movies/${movieGenreId}/${movie.id}`)
                }
                }} className='movie-card' key={movie.id}>
                <img className="poster-img" src={`${baseIMG}${movie.poster_path}`} alt='poster' />
                <div className='movie-card-overview'>
                    <h2>{movie.title}</h2>
                    <p className='p-small'>{movie.release_date}</p>
                    <Button className='z-over' onClick={() => setShowCreateReviewForm(true)}>Add review</Button>
                    <Button className='z-over' onClick={() => console.log('clicked')}>Add to wishlist</Button>
                </div>
            </div>

            {showCreateReviewForm && <CreateMovieReviewForm showForm={setShowCreateReviewForm} movie={data} />}
        </>
        
    )
}

export default MovieCard
