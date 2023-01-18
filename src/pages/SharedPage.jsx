import useGetCollection from '../hooks/useGetCollection'
import {useAuthContext} from '../contexts/AuthContext'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'
import Review from '../components/Review'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import useGetDoc from '../hooks/useGetDoc'
import ReceivedReviewCard from '../components/ReceivedReviewCard'

const SharedPage = () => {
    const {currentUser} = useAuthContext()
    // const [showDetails, setShowDetails] = useState(false)
    const [clickedReview, setClickedReview] = useState(null)
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/received`)

    const handleSeeDetails = (review) => {
        // setShowDetails(true)
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
                        // <div key={review.uid}>
                        //     <h2>{review.is_movie ? review.title : review.name}</h2>
                        //     <p>from: {review.from_user}</p>
                        //     <p>Have you read their review yet? {review.seen ? 'yes' : 'no'}</p>
                        //     <Button onClick={() => handleSeeDetails(review)}>See details</Button>
                        // </div>
                        <ReceivedReviewCard key={review.uid} review={review} handleSeeDetails={handleSeeDetails} />
                    ))}

                    {clickedReview && <Review setClickedReview={setClickedReview} review={clickedReview} />}
                </>
            )}
        </div>
    )
}

export default SharedPage
