import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getMovie } from '../services/tmdbAPI'

const MoviePage = () => {
    const { movieId } = useParams()
    const { data, isLoading, error, isError } = useQuery(['movie', movieId], () => getMovie(movieId))

    return (
        <div>
            {isLoading && (<p>loading...</p>)}
            {isError && (<p>ERROR: {error.message}</p>)}
            {data && (
                <p>
                    This movie: {data.title}
                </p>
            )}
        </div>
    )
}

export default MoviePage
