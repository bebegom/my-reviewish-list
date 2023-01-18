import React from 'react'
import Rating from './Rating'

const Review = ({ review, setClickedReview }) => {
	console.log(review)
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
			</div>
		</div>
	)
}

export default Review
