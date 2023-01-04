import './assets/scss/App.scss'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import LogoutPage from './pages/LogoutPage'
import ToplistsPage from './pages/ToplistsPage'
import MovieGenrePage from './pages/MovieGenrePage'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import RequireAuth from './components/RequireAuth'
import { useAuthContext } from './contexts/AuthContext'
import { ReactQueryDevtools } from 'react-query/devtools'
import TvshowGenrePage from './pages/TvshowGenrePage'
import TvshowPage from './pages/TvshowPage'
import MoviePage from './pages/MoviePage'

function App() {
	const { currentUser } = useAuthContext()

	return (
		<div id='App'>
			<Navigation />

			<Routes>
				{/* -------------------------------- GUEST -------------------------------- */}
				<Route path={"/"} element={
					// if user is logged in navigate to home-page
					currentUser ? <Navigate to={'/home'} /> : <LoginPage />
				} />
				<Route path={"/signup"} element={
					// if user is logged in navigate to home-page
					currentUser ? <Navigate to={'/home'} /> : <SignupPage />
				} />
				<Route path={"*"} element={<NotFoundPage />} />

				{/* ------------------------------ PROTECTED ------------------------------ */}
				<Route path={"/home"} element={
					<RequireAuth>
						<HomePage />
					</RequireAuth>
				} />
				<Route path={"/logout"} element={
					<RequireAuth>
						<LogoutPage />
					</RequireAuth>
				} />
				{/* <Route path={"/shared"} element={<SharedPage />} /> */}

				<Route path={"/toplists"} element={
					<RequireAuth>
						<ToplistsPage />
					</RequireAuth>
				} />
				{/* <Route path={"/toplists/most-active"} element={<MostActivePage />} /> */}
				{/* <Route path={"/toplists/most-watched"} element={<MostWatchedPage />} /> */}
				{/* <Route path={"/toplists/most-wanted"} element={<MostWantedPage />} /> */}

				{/* <Route path={"/create/movie"} element={<CreateMoviePage />} /> */}
				{/* <Route path={"/create/tvshow"} element={<CreateTvshowPage />} /> */}
				{/* <Route path={"/edit-review"} element={<EditReviewPage />} /> */}

				<Route path={"/movies/:movieGenreId"} element={
					<RequireAuth>
						<MovieGenrePage />
					</RequireAuth>
				} />
				<Route path={"/movies/:movieGenreId/:movieId"} element={
					<RequireAuth>
						<MoviePage />
					</RequireAuth>
				} />
				<Route path={"/tvshows/:tvshowGenreId"} element={
					<RequireAuth>
						<TvshowGenrePage />
					</RequireAuth>
				} />
				{/* <Route path={"/tvshows/genres/:genreId"} element={<TvshowsGenrePage />} /> */}
				<Route path={"/tvshows/:tvshowGenreId/:tvshowId"} element={
				<RequireAuth>
					<TvshowPage />
				</RequireAuth>
				} />

				{/* <Route path={"/my-reviews"} element={<MyReviewsPage />} /> */}
				{/* <Route path={"/my-reviews/:reviewId"} element={<MyReviewPage />} /> */}

				{/* <Route path={"/my-wish-list"} element={<MyWishListPage />} /> */}

			</Routes>

			<ReactQueryDevtools />
		</div>
	)
}

export default App
