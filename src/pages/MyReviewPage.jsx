import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import useGetDoc from '../hooks/useGetDoc'
import useGetCollection from '../hooks/useGetCollection'
import { baseIMG } from '../services/tmdbAPI'
import EmailToShareWithInput from '../components/EmailToShareWithInput'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'
import CreateMovieReviewForm from '../components/CreateMovieReviewForm'
import CreateTvshowReviewForm from '../components/CreateTvshowReviewForm'
import Rating from '../components/Rating'
import ErrorMessage from '../components/ErrorMessage'
import { Container } from 'react-bootstrap'

const MyReviewPage = () => {
    const { myReviewId } = useParams()
    const { currentUser } = useAuthContext()
    const { data, loading } = 	useGetDoc(`users/${currentUser.uid}/reviews`, myReviewId)
    const [wannaShare, setWannaShare] = useState(false)
    const [wannaEdit, setWannaEdit] = useState(false)
	const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')
	const navigate = useNavigate()
    const [errorOccurred, setErrorOccurred] = useState(null)

    const deleteFromReviews = async () => {
		try {
			// delete from users collection of reviews
			const usersReviewsRef = doc(db, `users/${currentUser.uid}/reviews`, data.uid)
			await deleteDoc(usersReviewsRef)

			// delete from reviews-collection
			const thisReview = allReviews.find(review => review.user_review_uid == data.uid)

			const ref = doc(db, `reviews`, thisReview.uid)
			await deleteDoc(ref)

			navigate('/my-reviews')
		} catch (e) {
			setErrorOccurred("Couldn't delete your review")
		}
    }

	return (
		<Container className='my-3'>
			{loading && <p>loading...</p>}
			{errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
			{data && (
				<>
					<div className='review-content my-3'>
						<div>
							<div className='d-flex'>
								{data.poster_path && <img className='poster-img' src={`${baseIMG}${data.poster_path}`} alt="poster" />}
								<div className='d-flex flex-column mx-2'>
									<h1>{data.is_movie ? data.title : data.name}</h1>
									{data.release_date && (
										<p>{data.is_movie ? data.release_date.split('-')[0] : ''}</p>
									)}
									<Rating myRating={data.my_rating} />
								</div>
							</div>
							<div>
								<h2>Favorite character</h2>
								<p>{data.favorite_character}</p>
							</div>
							{data.is_tvshow && (
								<div>
									<h2>Favorite season</h2>
									<p>season {data.favorite_season}</p>
								</div>
							)}
						</div>
					
						<div>
							<h2>Review</h2>
							<div className='my-review-content'>
								{data.my_review}
							</div>
						</div>
					</div>

					<div className='btns-container'>
						<button	className='btn-secondary' onClick={() => setWannaShare(true)}>Share</button>
						<button className='btn-secondary' onClick={() => setWannaEdit(true)}>Edit</button>
						<button className='btn-primary' onClick={deleteFromReviews}>Delete</button>
					</div>

					{wannaShare && <EmailToShareWithInput 
					setWannaShare={setWannaShare} review={data} />}

					{wannaEdit && data.is_movie && <CreateMovieReviewForm
					showForm={setWannaEdit} review={data} />}

					{wannaEdit && data.is_tvshow && <CreateTvshowReviewForm
					showForm={setWannaEdit} review={data} />}
				</>
			)}
		</Container>
	)
}

export default MyReviewPage
