import React from 'react'
import FullStarImg from '../assets/images/full-rating.png'

const ToplistCard = ({ email, index, arraysOfEmailAndCount, wishlist = false }) => {
    return (
        <>
            <div className='toplist-card'>
                <div className='d-flex flex-row align-items-start toplist-place'>
                <h1>{index+1}</h1>
                {index == 0 && <img className='toplist-star' src={FullStarImg} />}
                </div>
                <div>
                <h6>
                    {email}
                </h6>
                <p className='p-small'>
                (with {arraysOfEmailAndCount[0][index]} {wishlist ? 'wishes' : 'reviews made'})
                </p>
                </div>
            </div>
        </>
    )
}

export default ToplistCard
