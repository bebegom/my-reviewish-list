import React, { useEffect, useRef, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import MovieCard from '../components/MovieCard'
import { searchMovie, searchTvshow } from '../services/tmdbAPI'
import Pagination from '../components/Pagination'
import TvshowCard from '../components/TvshowCard'

const SearchPage = () => {
    const searchRef = useRef()
    const [loading, setLoading] = useState(false)
    const [searchPage, setSearchPage] = useState(1)
    const [searchResult, setSearchResult] = useState(null)
    const [selectedType, setSelectedType] = useState('movies')

    const getNewPage = async () => {
        setLoading(true)
        const res = await searchMovie(searchRef.current.value, searchPage, selectedType)
        setSearchResult(res)
        setLoading(false)
    }

    useEffect( ()=> {
        getNewPage()
    }, [searchPage])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(searchRef.current.value === '') {
            setSearchResult(null)
            setLoading(false)
            return
        }
        
        setSearchPage(1)
        const res = await searchMovie(searchRef.current.value, searchPage, selectedType)
        setSearchResult(res)

        setLoading(false)
       
    }

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="my-3">
        
        <Form.Select onChange={(value) => setSelectedType(value.currentTarget.value)}>
            <option value="movies">Movies</option>
            <option value="tvshows">Tvshows</option>
        </Form.Select>
        <Form.Control ref={searchRef} type="text" placeholder={`search for ${selectedType}`} className="my-2" />
      </Form>

      {loading && (
        <p>loading...</p>
      )}

      {searchResult && (
        <>
            <section className='grid'>
                {selectedType == 'movies' && (

                    searchResult.results.map(item => (
                        <MovieCard key={item.id} movie={item} />
                        ))
                )}

                {selectedType == 'tvshows' && (

                searchResult.results.map(item => (
                    <TvshowCard key={item.id} tvshow={item} />
                    ))
                )}
                
            </section>
            {searchResult.results.length > 0 && (
              <Pagination changePage={setSearchPage} page={searchPage} isPreviousData={loading} totalPages={searchResult.total_pages} />
            )}
        </>
      )}
    </Container>
  )
}

export default SearchPage
