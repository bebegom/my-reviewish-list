import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import useGetDoc from '../hooks/useGetDoc'
import Button from 'react-bootstrap/Button'
import EmailToShareWithInput from '../components/EmailToShareWithInput'


const MyReviewPage = () => {
    const { myReviewId } = useParams()
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetDoc(`users/${currentUser.uid}/reviews`, myReviewId)
    const [wannaShare, setWannaShare] = useState(false)

    console.log('data: ', data)

  return (
    <div>
        {loading && <p>loading...</p>}
        {data && (
            <>
                My review of: {data.title}
                <Button onClick={() => setWannaShare(true)}>Share</Button>

                {wannaShare && <EmailToShareWithInput setWannaShare={setWannaShare} review={data} />}
            </>
        )}
    </div>
  )
}

export default MyReviewPage
