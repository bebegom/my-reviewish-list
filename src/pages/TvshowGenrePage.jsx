import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getTvshowGenre, getTvshowGenres } from '../services/tmdbAPI'
import Button from 'react-bootstrap/Button'
import Pagination from '../components/Pagination'
import TvshowCard from '../components/TvshowCard'

const TvshowGenrePage = () => {
    const [nameOfThisGenre, setNameOfThisGenre] = useState('')
    const { tvshowGenreId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams({ query: '', page: 1 })
    const page = searchParams.get('page')
    const { data, isLoading, error, isError, isPreviousdata } = useQuery(['tvshowGenre', tvshowGenreId, page], () => getTvshowGenre(tvshowGenreId, page), { keepPreviousData: true })

    const getNameOfThisTvshowGenre = async () => {
        const allTvshowGenresData = await getTvshowGenres()
        const thisTvshowGenre = allTvshowGenresData.genres.find(i => i.id == tvshowGenreId)
        setNameOfThisGenre(thisTvshowGenre.name)
    }

    useEffect(() => {
        getTvshowGenre(tvshowGenreId, page)
        getNameOfThisTvshowGenre()
    }, [page, tvshowGenreId])

    return (
        <div>

            {isLoading && (<p>Loading movies...</p>)}
            {isError && (<p>ERROR {error.message}</p>)}

            {data && (
                <>
                    <h1>Tvshows - {nameOfThisGenre}</h1>
                    {data.results.map(tvshow => (
                        <TvshowCard tvshow={tvshow} />
                    ))}

                    <Pagination page={page} changePage={setSearchParams} isPreviousData={isPreviousdata}/>
                </>
            )}
        </div>
    )
}

export default TvshowGenrePage
