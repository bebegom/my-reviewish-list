import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
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

const MyReviewPage = () => {
    const { myReviewId } = useParams()
    const { currentUser } = useAuthContext()
    const { data, loading } = 	useGetDoc(`users/${currentUser.uid}/reviews`, myReviewId)
    const [wannaShare, setWannaShare] = useState(false)
    const [wannaEdit, setWannaEdit] = useState(false)
	const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')

    const deleteFromReviews = async () => {
		// delete from users collection of reviews
		const usersReviewsRef = doc(db, `users/${currentUser.uid}/reviews`, data.uid)
        await deleteDoc(usersReviewsRef)
		console.log('deleted from user')

		// delete from reviews-collection
		const thisReview = allReviews.find(review => review.user_review_uid == data.uid)

		const ref = doc(db, `reviews`, thisReview.uid)
        await deleteDoc(ref)
		console.log('deleted from reviews')
    }

	return (
	<div>
		{loading && <p>loading...</p>}
		{data && (
			<>
				<div className='d-flex'>
					<img className='poster-img' src={`${baseIMG}${data.poster_path}`} alt="poster" />
					<div className='d-flex flex-column justify-content-between'>
						<h1>{data.is_movie ? data.title : data.name}</h1>
						<p>{data.is_movie ? data.release_date.split('-')[0] : ''}</p>
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
				<div>
					<h2>Review</h2>
					<div className='review-content'>
						{data.my_review}
					</div>
				</div>

				<button	className='btn-secondary full-width' onClick={() => setWannaShare(true)}>Share</button>
				<button className='btn-secondary full-width' onClick={() => setWannaEdit(true)}>Edit</button>
				<button className='btn-primary full-width' onClick={deleteFromReviews}>Delete</button>

				{wannaShare && <EmailToShareWithInput 
				setWannaShare={setWannaShare} review={data} />}

				{wannaEdit && data.is_movie && <CreateMovieReviewForm
				showForm={setWannaEdit} review={data} />}

				{wannaEdit && data.is_tvshow && <CreateTvshowReviewForm
				showForm={setWannaEdit} review={data} />}
			</>
		)}
	</div>
	)
}

export default MyReviewPage
