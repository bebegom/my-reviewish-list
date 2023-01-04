import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { getTvshowGenre, getTvshowGenres } from '../services/tmdbAPI'

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

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <div>

            {isLoading && (<p>Loading movies...</p>)}
            {isError && (<p>ERROR {error.message}</p>)}

            {data && (
                <>
                    {nameOfThisGenre}
                    {data.results.map(tvshow => (
                        <p key={tvshow.id}>{tvshow.name}</p>
                    ))}
                </>
            )}
        </div>
    )
}

export default TvshowGenrePage
