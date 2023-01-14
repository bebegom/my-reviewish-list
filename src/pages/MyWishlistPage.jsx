import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import WishlistItemCard from "../components/WishlistItemCard"

const MyWishlistPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/wishlist`)

    return (
        <>
            {loading && (<p>loading...</p>)}

            {data && (
                <>
                <p>We have your list</p>
                {data.map(item => (
                    <WishlistItemCard item={item} />
                ))}
            </>
            )}
        </>
    )
}

export default MyWishlistPage
