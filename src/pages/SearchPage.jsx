import React, { useEffect, useRef, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import MovieCard from '../components/MovieCard'
import { searchMovie } from '../services/tmdbAPI'
import Pagination from '../components/Pagination'

const SearchPage = () => {
    const searchRef = useRef()
    const [loading, setLoading] = useState(false)
    const [searchPage, setSearchPage] = useState(1)
    const [searchResult, setSearchResult] = useState(null)

    const getNewPage = async () => {
        setLoading(true)
        const res = await searchMovie(searchRef.current.value, searchPage)
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
        console.log('searching with ' + searchRef.current.value)
        const res = await searchMovie(searchRef.current.value, searchPage)
        setSearchResult(res)
        console.log(res)

        setLoading(false)
       
    }

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="my-3">
        <Form.Label>Search</Form.Label>
        <Form.Control ref={searchRef} type="text" placeholder='search' />
      </Form>

      {loading && (
        <p>loading...</p>
      )}

      {searchResult && (
        <>
            <section className='grid'>
                {searchResult.results.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                    ))}
            </section>

            <Pagination changePage={setSearchPage} page={searchPage} isPreviousData={loading} totalPages={searchResult.total_pages} />
        </>
      )}
    </Container>
  )
}

export default SearchPage
