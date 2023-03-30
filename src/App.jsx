import './assets/scss/App.scss'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import LogoutPage from './pages/LogoutPage'
import ToplistsPage from './pages/ToplistsPage'
import MovieGenrePage from './pages/MovieGenrePage'
import SharedPage from './pages/SharedPage'
import MyWishlistPage from './pages/MyWishlistPage'
import MyReviewsPage from './pages/MyReviewsPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import RequireAuth from './components/RequireAuth'
import { useAuthContext } from './contexts/AuthContext'
import { ReactQueryDevtools } from 'react-query/devtools'
import TvshowGenrePage from './pages/TvshowGenrePage'
import TvshowPage from './pages/TvshowPage'
import MoviePage from './pages/MoviePage'
import MostWatchedPage from './pages/toplists/MostWatchedPage'
import MostWantedPage from './pages/toplists/MostWantedPage'
import MostActiveUserPage from './pages/toplists/MostActiveUserPage'
import MyReviewPage from './pages/MyReviewPage'
import MyfolderPage from './pages/MyfolderPage'
import SearchPage from './pages/SearchPage'

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

				<Route path={"/my-reviews"} element={
					<RequireAuth>
						<MyReviewsPage />
					</RequireAuth>
				} />
				<Route path={"/my-reviews/:myReviewId"} element={
					<RequireAuth>
						<MyReviewPage />
					</RequireAuth>
				} />
				<Route path={"/my-reviews/folders/:folderId"} element={
					<RequireAuth>
						<MyfolderPage />
					</RequireAuth>
				} />


				<Route path={"/my-wishlist"} element={
					<RequireAuth>
						<MyWishlistPage />
					</RequireAuth>
				} />
				<Route path={"/shared"} element={
					<RequireAuth>
						<SharedPage />
					</RequireAuth>
				} />

				<Route path={"/toplists"} element={
					<RequireAuth>
						<ToplistsPage />
					</RequireAuth>
				} />
				<Route path={"/toplists/most-watched"} element={
					<RequireAuth>
						<MostWatchedPage />
					</RequireAuth>
				} />
				<Route path={"/toplists/most-wanted"} element={
					<RequireAuth>
						<MostWantedPage />
					</RequireAuth>
				} />
				<Route path={"/toplists/most-active-user"} element={
					<RequireAuth>
						<MostActiveUserPage />
					</RequireAuth>
				} />

				<Route path={"/movies/genres/:movieGenreId"} element={
					<RequireAuth>
						<MovieGenrePage />
					</RequireAuth>
				} />
				<Route path={"/movies/:movieId"} element={
					<RequireAuth>
						<MoviePage />
					</RequireAuth>
				} />
				<Route path={"/tvshows/genres/:tvshowGenreId"} element={
					<RequireAuth>
						<TvshowGenrePage />
					</RequireAuth>
				} />
				<Route path={"/tvshows/:tvshowId"} element={
				<RequireAuth>
					<TvshowPage />
				</RequireAuth>
				} />
				
				<Route path={"/search"} element={
					<RequireAuth>
						<SearchPage />
					</RequireAuth>
				} />

			</Routes>

			<ReactQueryDevtools />
		</div>
	)
}

export default App
