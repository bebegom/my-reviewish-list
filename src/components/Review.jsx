import React from 'react'

const Review = ({ review, setClickedReview }) => {
  return (
    <div onClick={() => setClickedReview(null)} className='lightbox h-100'>
        <div className='lightbox-content'>
            this is received review about {review.title} from {review.from_user}
        </div>
    </div>
  )
}

export default Review
