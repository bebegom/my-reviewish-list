import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom"

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)

    return (
        <>
            {loading && <p>loading...</p>}

            {data && (
                <>
                    <p>We have your reviews</p>
                    {data.map(item => (
                        <div className="d-flex align-items-center" key={item.uid}>
                            {item.image && <Image src={item.image} alt='poster' width='100px'/>}
                            <div>
                                <h2>{item.title}</h2>
                                <Button as={Link} to={`/my-reviews/${item.uid}`}>Details</Button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}

export default MyReviewsPage
