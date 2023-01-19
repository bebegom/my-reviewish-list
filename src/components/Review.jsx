import React, { useState } from 'react'
import Rating from './Rating'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../contexts/AuthContext'
import ErrorMessage from './ErrorMessage'

const Review = ({ review, setClickedReview }) => {
    const { currentUser } = useAuthContext()
	const [errorOccurred, setErrorOccurred] = useState(null)

	const deleteReceivedReview = async () => {
		try {
			const ref = doc(db, `users/${currentUser.uid}/received`, review.received_uid)
			await deleteDoc(ref)

			setClickedReview(null)
		} catch (e) {
			setErrorOccurred("Couldn't delete review")
		}
	}

	return (
		<div onClick={() => setClickedReview(null)} className='lightbox h-100'>
			<div className='lightbox-content'>
				{errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
				<h1>
					{review.is_movie ? review.title : review.name}
				</h1>
				<p className='p-small'>
					{review.from_user}
				</p>
				<Rating myRating={review.my_rating}/>

				<h2>Review</h2>
				<p>
					{review.my_review}
				</p>

				<button onClick={deleteReceivedReview} className='btn-primary'>Delete</button>
			</div>
		</div>
	)
}

export default Review
