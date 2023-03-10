import React from 'react'
import EmptyStarIcon from '../assets/images/empty-rating.png'
import FullStarIcon from '../assets/images/full-rating.png'
import { useState } from 'react'

const Rating = ({ myRating, setMyRating = null }) => {
    const [hover, setHover] = useState(null)

    return (
        <div className='mt-3 mb-3'>
            {[...Array(5)].map((star, i) => {
                const ratingValue = i+1
                return <label key={i}>
                    <input  
                    type="radio" value={ratingValue} />
                    <img 
                        className='star' 
                        src={ ratingValue > (hover || myRating) ? EmptyStarIcon : FullStarIcon} 
                        alt="star" 
                        onClick={() => setMyRating ? setMyRating(ratingValue) : null} 
                        onMouseEnter={() => setMyRating ? setHover(ratingValue) : null}
                        onMouseLeave={() => setMyRating ? setHover(null) : null}
                    />
                </label>
            })}
        </div>
    )
}

export default Rating
