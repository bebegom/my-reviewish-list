import useGetCollection from '../hooks/useGetCollection'
import {useAuthContext} from '../contexts/AuthContext'
import { useState } from 'react'
import Review from '../components/Review'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import ReceivedReviewCard from '../components/ReceivedReviewCard'

const SharedPage = () => {
    const {currentUser} = useAuthContext()
    const [clickedReview, setClickedReview] = useState(null)
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/received`)

    const handleSeeDetails = (review) => {
        setClickedReview(review)

        // if review.seen is false update it to true
        if(!review.seen) {
            const ref = doc(db, `users/${currentUser.uid}/received`, review.received_uid)
            updateDoc(ref, {seen: true})
        }
    }
    
    return (
        <div>
            {loading && <p>loading...</p>}
            {data && (
                <>
                    <h1>Received reviews</h1>
                    {data.map(review => (
                        <ReceivedReviewCard key={review.uid} review={review} handleSeeDetails={handleSeeDetails} />
                    ))}

                    {clickedReview && <Review setClickedReview={setClickedReview} review={clickedReview} />}
                </>
            )}
        </div>
    )
}

export default SharedPage
