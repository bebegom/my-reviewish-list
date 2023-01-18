import React from 'react'
import Rating from './Rating'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthContext } from '../contexts/AuthContext'

const Review = ({ review, setClickedReview }) => {
    const { currentUser } = useAuthContext()
	console.log(review)
	const deleteReceivedReview = async () => {
		const ref = doc(db, `users/${currentUser.uid}/received`, review.received_uid)

		await deleteDoc(ref)
	}

	return (
		<div onClick={() => setClickedReview(null)} className='lightbox h-100'>
			<div className='lightbox-content'>
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
