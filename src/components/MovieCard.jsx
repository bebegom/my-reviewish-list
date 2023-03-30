import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { baseIMG, getMovie } from '../services/tmdbAPI'
import CreateMovieReviewForm from './CreateMovieReviewForm'

const MovieCard = ({ movie }) => {
    const { movieGenreId } = useParams()
    const navigate = useNavigate()
    const [showCreateReviewForm, setShowCreateReviewForm] = useState(false)
    const {data, isLoading, error, isError} = useQuery(['movie', movie.id], () => getMovie(movie.id))

    return (
        <> 
            {isError && <p>ERROR: {error.message}</p>}
            {isLoading && <p>Loading...</p>}
            {data && (
                <>
                    <div onClick={(e) => {
                        if(e.target.tagName != "BUTTON") {
                            return navigate(`/movies/${data.id}`)
                        }
                        }} className='movie-card' key={data.id}>
                        <img className="poster-img movie-card-poster" src={`${baseIMG}${data.poster_path}`} alt='poster' />
                        <div className='movie-card-overview'>
                            <h2>{data.title}</h2>
                            <p className='p-small'>{data.release_date}</p>
                        </div>
                    </div>

                    {showCreateReviewForm && <CreateMovieReviewForm showForm={setShowCreateReviewForm} movie={data} />}
                </>
            )}
        </>
        
    )
}

export default MovieCard
