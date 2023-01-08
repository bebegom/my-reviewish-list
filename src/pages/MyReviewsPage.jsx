import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { doc, deleteDoc, } from 'firebase/firestore'
import { db } from '../firebase'

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)

    const deleteFromWishlist = async (item) => {
        const ref = doc(db, `users/${currentUser.uid}/reviews`, item.uid)
        await deleteDoc(ref)
        console.log("deleted")
    }

    return (
        <>
            {loading && <p>loading...</p>}

            {data && (
                <>
                    <p>We have your reviews</p>
                    {data.map(item => (
                        <div className="d-flex align-items-center" key={item.id}>
                            {item.image && <Image src={item.image} alt='poster' width='100px'/>}
                            <div>
                                <h2>{item.title}</h2>
                                <Button onClick={() => deleteFromWishlist(item)}>Delete</Button>
                                <Button>Add review</Button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}

export default MyReviewsPage
