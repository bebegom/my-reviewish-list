import React, { useEffect, useRef, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import MovieCard from '../components/MovieCard'
import { searchMovie, searchTvshow } from '../services/tmdbAPI'
import Pagination from '../components/Pagination'
import TvshowCard from '../components/TvshowCard'
import { useSearchParams } from 'react-router-dom'

const SearchPage = () => {
    const searchRef = useRef()
    const [loading, setLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    // const [searchPage, setSearchPage] = useState(1)
    const [searchResult, setSearchResult] = useState(null)
    const [selectedType, setSelectedType] = useState('movies')

    const [searchParams, setSearchParams] = useSearchParams({ query: '', page: 1 })
    const page = searchParams.get('page')
    
    const getNewPage = async () => {
        setLoading(true)
        if(selectedType === 'tvshows') {
          const res = await searchTvshow(searchRef.current.value, page)
          setSearchResult(res)
          setLoading(false)
        } else {
          const res = await searchMovie(searchRef.current.value, page)
          setSearchResult(res)
          setLoading(false)
        }
    }

    useEffect( ()=> {
        getNewPage()
    }, [page])

    useEffect(() => {
      searchRef.current.value = '';
      setSearchResult(null)
      setIsSearching(false)
    }, [selectedType])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(searchRef.current.value === '') {
          setSearchResult(null)
          setIsSearching(false)
          setLoading(false)
          return
        }
        
        setIsSearching(true)
        // setSearchPage(1)
        if(selectedType === 'tvshows') {
          const res = await searchTvshow(searchRef.current.value, page)
          setSearchResult(res)
          setLoading(false)
        } else {
          const res = await searchMovie(searchRef.current.value, page)
          setSearchResult(res)
          setLoading(false)
        }
        
    }

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="my-3">
        
        <Form.Select onChange={(value) => setSelectedType(value.currentTarget.value)}>
            <option value="movies">Movies</option>
            <option value="tvshows">Tvshows</option>
        </Form.Select>
        <Form.Control ref={searchRef} type="text" placeholder={`search for ${selectedType}`} className="my-2" />

        <button type='submit' className='btn-primary'>Search</button>
      </Form>

      {loading && (
        <p>loading...</p>
      )}

      {!searchResult || !isSearching && (
        <div className='d-flex align-items-center justify-content-center text-muted'>Start searching</div>
      )}

      {isSearching && searchResult && searchResult.results != null && searchResult.results == 0 && (
              <div className='d-flex align-items-center justify-content-center text-muted'>Nothing was found</div>
            )}

      {searchResult && searchResult.results != null && (
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
              <Pagination changePage={setSearchParams} page={page} isPreviousData={loading} totalPages={searchResult.total_pages} />
            )}
        </>
      )}
    </Container>
  )
}

export default SearchPage
