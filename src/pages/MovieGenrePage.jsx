import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useQuery } from 'react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import Pagination from '../components/Pagination'
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
                <h1>Movies - {nameOfThisGenre}</h1>
                    {data.results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}

                    <Pagination page={page} changePage={setSearchParams} isPreviousData={isPreviousdata}/>
                </>
            )}
        </div>
    )
}

export default MovieGenrePage
