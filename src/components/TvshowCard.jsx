import { useParams, useNavigate } from 'react-router-dom'
import { baseIMG, getTvshow } from '../services/tmdbAPI'
import CreateTvshowReviewForm from './CreateTvshowReviewForm'
import { useState } from 'react'
import { useQuery } from 'react-query'

const TvshowCard = ({ tvshow }) => {
    const { tvshowGenreId } = useParams()
    const {data, isLoading, error, isError} = useQuery(['tvshow', tvshow.id], () => getTvshow(tvshow.id))
    const navigate = useNavigate()
    const [showCreateReviewForm, setShowCreateReviewForm] = useState(false)

    return (
        <>
            {isError && <p>ERROR: {error.message}</p>}
            {isLoading && <p>loading...</p>}
            {data && (
                <>
                    <div onClick={(e) => {
                        if(e.target.tagName != "BUTTON") {
                            return navigate(`/tvshows/${tvshowGenreId}/${data.id}`)
                        }
                    }} className='movie-card' key={data.id}>
                        <img className='poster-img' src={`${baseIMG}${data.poster_path}`} />
                        <div>
                            <h2>{data.name}</h2>
                        </div>
                    </div>

                    {showCreateReviewForm && <CreateTvshowReviewForm showForm={setShowCreateReviewForm} tvshow={data} />}
                </>
            )}
        </>
    )
}

export default TvshowCard
