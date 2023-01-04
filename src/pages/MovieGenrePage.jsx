import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { getMovieGenre, getMovieGenres } from '../services/tmdbAPI'

const MovieGenrePage = () => {
    const [nameOfThisGenre, setNameOfThisGenre] = useState('')
    const { movieGenreId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams({ query: '', page: 1 })
    const page = searchParams.get('page')
    const { data, isLoading, error, isError, isPreviousdata } = useQuery(['movieGenre', movieGenreId, page], () => getMovieGenre(movieGenreId, page), { keepPreviousData: true })

    const getNameOfThisMovieGenre = async () => {
        const allMovieGenresData = await getMovieGenres()
        const thisMovieGenre = allMovieGenresData.genres.find(i => i.id == movieGenreId)
        setNameOfThisGenre(thisMovieGenre.name)
    }

    useEffect(() => {
        getMovieGenre(movieGenreId, page)
        getNameOfThisMovieGenre()
    }, [page, movieGenreId])

    return (
        <div>

            {isLoading && (<p>Loading movies...</p>)}
            {isError && (<p>ERROR {error.message}</p>)}

            {data && (
                <>
                    {nameOfThisGenre}
                    {data.results.map(movie => (
                        <p key={movie.id}>{movie.title}</p>
                    ))}
                </>
            )}
        </div>
    )
}

export default MovieGenrePage
