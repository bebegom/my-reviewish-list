import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { getTvshowGenre, getTvshowGenres } from '../services/tmdbAPI'
import Pagination from '../components/Pagination'
import TvshowCard from '../components/TvshowCard'
import Container from 'react-bootstrap/Container'

const TvshowGenrePage = () => {
    const [nameOfThisGenre, setNameOfThisGenre] = useState('')
    const { tvshowGenreId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams({ query: '', page: 1 })
    const page = searchParams.get('page')
    const { data, isLoading, error, isError, isPreviousdata } = useQuery(['tvshowGenre', tvshowGenreId, page], () => getTvshowGenre(tvshowGenreId, page), { keepPreviousData: true })
    const [errorOccurred, setErrorOccurred] = useState(null)


    const getNameOfThisTvshowGenre = async () => {
        try {
            const allTvshowGenresData = await getTvshowGenres()
            const thisTvshowGenre = allTvshowGenresData.genres.find(i => i.id == tvshowGenreId)
            setNameOfThisGenre(thisTvshowGenre.name)
        } catch (e) {
            setErrorOccurred('Could not get the name of genre')
        }
        
    }

    useEffect(() => {
        getTvshowGenre(tvshowGenreId, page)
        getNameOfThisTvshowGenre()
    }, [page, tvshowGenreId])

    return (
        <Container>

            {isLoading && (<p>Loading movies...</p>)}
            {isError && (<p>ERROR {error.message}</p>)}

            {data && (
                <>
                    {errorOccurred && <h1>{errorOccurred}</h1>}
                    {!errorOccurred && <h1>Tvshows - {nameOfThisGenre}</h1>}
                    <section className='grid'>
                        {data.results.map(tvshow => (
                            <TvshowCard key={tvshow.id} tvshow={tvshow} />
                        ))}
                    </section>

                    <Pagination page={page} changePage={setSearchParams} isPreviousData={isPreviousdata}/>
                </>
            )}
        </Container>
    )
}

export default TvshowGenrePage
