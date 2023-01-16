import { useState } from 'react'
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
                    <button className='btn-primary' onClick={() => setShowCreateReviewForm(true)}>Add review</button>
                    {/* TODO: fix onClick-function */}
                    <button className='btn-secondary' onClick={() => console.log('clicked')}>Add to wishlist</button> 
                </div>
            </div>

            {showCreateReviewForm && <CreateMovieReviewForm showForm={setShowCreateReviewForm} movie={data} />}
        </>
        
    )
}

export default MovieCard
