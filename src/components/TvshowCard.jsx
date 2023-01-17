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

    console.log(tvshow)

    return (
        <>
            <div onClick={(e) => {
                if(e.target.tagName != "BUTTON") {
                    return navigate(`/tvshows/${tvshowGenreId}/${tvshow.id}`)
                }
            }} className='movie-card' key={tvshow.id}>
                <img className='poster-img' src={`${baseIMG}${tvshow.poster_path}`} />
                <div>
                    <h2>{tvshow.name}</h2>
                    <button className='btn-primary' onClick={() => setShowCreateReviewForm(true)}>Add review</button>
                    <button className='btn-secondary'>Add to wishlist</button>
                </div>
            </div>

            {showCreateReviewForm && <CreateTvshowReviewForm showForm={setShowCreateReviewForm} tvshow={data} />}
        </>
        
    )
}

export default TvshowCard
