import './assets/scss/App.scss'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import LogoutPage from './pages/LogoutPage'
import ToplistsPage from './pages/ToplistsPage'
import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'

function App() {
	return (
		<>
			<Navigation />

			<Routes>
				{/* -------------------------------- GUEST -------------------------------- */}
				<Route path={"/"} element={<LoginPage />} />
				<Route path={"*"} element={<NotFoundPage />} />
				<Route path={"/signup"} element={<SignupPage />} />

				{/* ------------------------------ LOGGED IN ------------------------------ */}
				<Route path={"/home"} element={<HomePage />} />
				<Route path={"/logout"} element={<LogoutPage />} />
				{/* <Route path={"/shared"} element={<SharedPage />} /> */}

				<Route path={"/toplists"} element={<ToplistsPage />} />
				{/* <Route path={"/toplists/most-active"} element={<MostActivePage />} /> */}
				{/* <Route path={"/toplists/most-watched"} element={<MostWatchedPage />} /> */}
				{/* <Route path={"/toplists/most-wanted"} element={<MostWantedPage />} /> */}

				{/* <Route path={"/create/movie"} element={<CreateMoviePage />} /> */}
				{/* <Route path={"/create/tvshow"} element={<CreateTvshowPage />} /> */}
				{/* <Route path={"/edit-review"} element={<EditReviewPage />} /> */}

				{/* <Route path={"/movies"} element={<MoviesPage />} /> */}
				{/* <Route path={"/movies/genres/:genreId"} element={<MoviesGenrePage />} /> */}
				{/* <Route path={"/movies/:movieId"} element={<MoviePage />} /> */}
				{/* <Route path={"/tvshows"} element={<TvshowsPage />} /> */}
				{/* <Route path={"/tvshows/genres/:genreId"} element={<TvshowsGenrePage />} /> */}
				{/* <Route path={"/tvshows/:tvshowId"} element={<TvshowPage />} /> */}

				{/* <Route path={"/my-reviews"} element={<MyReviewsPage />} /> */}
				{/* <Route path={"/my-reviews/:reviewId"} element={<MyReviewPage />} /> */}

				{/* <Route path={"/my-wish-list"} element={<MyWishListPage />} /> */}

			</Routes>
		</>
	)
}

export default App
