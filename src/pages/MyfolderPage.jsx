import { useParams } from 'react-router-dom'
import ReviewItemCard from '../components/ReviewItemCard'
import { useAuthContext } from '../contexts/AuthContext'
import useGetCollection from '../hooks/useGetCollection'
// import { db } from '../firebase'
import useGetDoc from '../hooks/useGetDoc'

const MyfolderPage = () => {
    const { folderId } = useParams()
    const { currentUser } = useAuthContext()
    const { data: folder, loading: folderLoading } = useGetDoc(`users/${currentUser.uid}/folders`, folderId)
    const { data: reviews, loading: reviewsLoading } = useGetCollection(`users/${currentUser.uid}/reviews`)

    const reviewsInFolder = reviews.filter((review) => {
        if(review.folder) {
            if(review.folder.id == folderId) {
                return review
            }
        }
        
    })
    
    console.log(reviewsInFolder)

    return (
        <div>
            folder: {folderId}
            {reviewsInFolder && (
                <>
                    {reviewsInFolder.map(review => (
                        <ReviewItemCard item={review} />
                    ))}
                </>
            )}
        </div>
    )
}

export default MyfolderPage
