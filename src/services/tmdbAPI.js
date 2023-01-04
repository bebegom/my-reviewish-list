import axios from 'axios'

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