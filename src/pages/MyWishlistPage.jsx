import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"

const MyWishlistPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/wishlist`)

    console.log(data)

    return (
        <>
            {loading && (<p>loading...</p>)}

            {data && (
                <p>
                    we have your list
                </p>
            )}
        </>
    )
}

export default MyWishlistPage
