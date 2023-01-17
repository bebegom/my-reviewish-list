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
            {data && (
                <>
                    <div onClick={(e) => {
                        if(e.target.tagName != "BUTTON") {
                            return navigate(`/movies/${movieGenreId}/${data.id}`)
                        }
                        }} className='movie-card' key={data.id}>
                        <img className="poster-img" src={`${baseIMG}${data.poster_path}`} alt='poster' />
                        <div className='movie-card-overview'>
                            <h2>{data.title}</h2>
                            <p className='p-small'>{data.release_date}</p>
                            {/* <button className='btn-primary' onClick={() => setShowCreateReviewForm(true)}>Add review</button>
                            
                            <button className='btn-secondary' onClick={() => console.log('clicked')}>Add to wishlist</button>  */}
                        </div>
                    </div>

                    {showCreateReviewForm && <CreateMovieReviewForm showForm={setShowCreateReviewForm} movie={data} />}
                </>
            )}
           
        </>
        
    )
}

export default MovieCard
