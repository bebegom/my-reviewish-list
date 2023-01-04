import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { getTvshow } from '../services/tmdbAPI'

const TvshowPage = () => {
    const { tvshowId } = useParams()
    const { data, isLoading, error, isError } = useQuery(['tvshow', tvshowId], () => getTvshow(tvshowId))

    return (
        <div>
            {isLoading && (<p>loading...</p>)}
            {isError && (<p>ERROR: {error.message}</p>)}
            {data && (
                <p>
                    This tvshow: {data.name}
                </p>
            )}
        </div>
    )
}

export default TvshowPage
