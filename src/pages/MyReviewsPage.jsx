import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)

    return (
        <>
            {loading && <p>loading...</p>}

            {data && (
                <p>We have your reviews</p>
            )}
        </>
    )
}

export default MyReviewsPage
