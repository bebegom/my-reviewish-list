import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import useGetDoc from '../hooks/useGetDoc'
import useGetCollection from '../hooks/useGetCollection'
import Button from 'react-bootstrap/Button'
import EmailToShareWithInput from '../components/EmailToShareWithInput'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'

const MyReviewPage = () => {
    const { myReviewId } = useParams()
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetDoc(`users/${currentUser.uid}/reviews`, myReviewId)
    const [wannaShare, setWannaShare] = useState(false)
	const {data: allReviews, loading: allReviewsLoading} = useGetCollection('reviews')

	const thisReview = allReviews.find(review => review.user_review_uid)

    console.log('data: ', data)

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

				{wannaShare && <EmailToShareWithInput setWannaShare={setWannaShare} review={data} />}
			</>
		)}
	</div>
	)
}

export default MyReviewPage
