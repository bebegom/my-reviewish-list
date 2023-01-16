import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import ReviewItemCard from "../components/ReviewItemCard"

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)


    return (
        <>
            {loading && <p>loading...</p>}

            {data && (
                <>
                    <p>we have reviews</p>
                    {data.map(item => (
                        <ReviewItemCard item={item} key={item.id} />
                    ))}
                </>
            )}
        </>
    )
}

export default MyReviewsPage
