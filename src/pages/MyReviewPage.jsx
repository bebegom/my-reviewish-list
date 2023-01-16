import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import useGetDoc from '../hooks/useGetDoc'
import useGetCollection from '../hooks/useGetCollection'
import Button from 'react-bootstrap/Button'
import EmailToShareWithInput from '../components/EmailToShareWithInput'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'
import CreateMovieReviewForm from '../components/CreateMovieReviewForm'
import CreateTvshowReviewForm from '../components/CreateTvshowReviewForm'

const MyReviewPage = () => {
    const { myReviewId } = useParams()
    const { currentUser } = useAuthContext()
    const { data, loading } = 	useGetDoc(`users/${currentUser.uid}/reviews`, myReviewId)
    const [wannaShare, setWannaShare] = useState(false)
    const [wannaEdit, setWannaEdit] = useState(false)
	const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')

	const thisReview = allReviews.find(review => review.user_review_uid)

    const editReview = () => {

	}

    const deleteFromReviews = async () => {
		// delete from users collection of reviews
		const usersReviewsRef = doc(db, `users/${currentUser.uid}/reviews`, data.uid)
        await deleteDoc(usersReviewsRef)
		console.log('deleted from user')

		// delete from reviews-collection
		const ref = doc(db, `reviews`, thisReview.uid)
        await deleteDoc(ref)
		console.log('deleted from reviews')
    }

	return (
	<div>
		{loading && <p>loading...</p>}
		{data && (
			<>
				My review of: {data.title}
				<Button onClick={() => setWannaShare(true)}>Share</Button>
				<Button onClick={deleteFromReviews}>Delete</Button>
				<Button onClick={() => setWannaEdit(true)}>Edit</Button>

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
