import React from 'react'
import EmptyStarIcon from '../assets/images/empty-rating.png'
import FullStarIcon from '../assets/images/full-rating.png'
import {useState} from 'react'

const Rating = ({ myRating, setMyRating = null }) => {
    const [hover, setHover] = useState(null)

    return (
        <div>
            {[...Array(5)].map((star, i) => {
                const ratingValue = i+1
                return <label key={i}>
                    <input 
                    // key={10 + i} 
                    type="radio" value={ratingValue} />
                    <img 
                        className='star' 
                        // key={i} 
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
