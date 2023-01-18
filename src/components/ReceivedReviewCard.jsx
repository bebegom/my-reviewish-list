import React from 'react'

const ReceivedReviewCard = ({ review, handleSeeDetails }) => {
    return (
        <div className='received-review-card'>
            <h2>{review.is_movie ? review.title : review.name}</h2>
            <p>from: {review.from_user}</p>
            <p>Have you read their review yet? {review.seen ? 'yes' : 'no'}</p>
            <button className='btn-primary' onClick={() => handleSeeDetails(review)}>See details</button>
        </div>
    )
}

export default ReceivedReviewCard
