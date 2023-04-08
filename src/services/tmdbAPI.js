import axios from 'axios'

export const baseIMG = "https://image.tmdb.org/t/p/w300"

axios.defaults.baseURL = 'https://api.themoviedb.org/3'

const get = async (endpoint) => {
    const res = await axios.get(endpoint)
    return res.data
}

export const getMovieGenres = () => {
    return get(`/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`)
}

export const getTvshowGenres = () => {
    return get(`/genre/tv/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`)
}

export const getMovieGenre = (genre, page) => {
    return get(`/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=${genre}&page=${page}`)
}

export const getTvshowGenre = (genre, page) => {
    return get(`/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=${genre}&page=${page}`)
}

export const getMovie = (id) => {
    return get(`/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&append_to_response=credits`)
}

export const getTvshow = (id) => {
    return get(`/tv/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&append_to_response=credits`)
}

export const searchMovie = (searchQuery, page, init = false) => {
    if(init) {
        return {results: null}
    }
    return get(`/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&query=${searchQuery}&page=${page}&include_adult=false`)
}

export const searchTvshow = (searchQuery, page) => {
    return get(`/search/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&query=${searchQuery}&page=${page}&include_adult=false`)
}

