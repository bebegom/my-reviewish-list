import { useParams, useNavigate } from 'react-router-dom'
import ReviewItemCard from '../components/ReviewItemCard'
import { useAuthContext } from '../contexts/AuthContext'
import useGetCollection from '../hooks/useGetCollection'
import useGetDoc from '../hooks/useGetDoc'
import { db } from '../firebase'
import { addDoc, doc, updateDoc, collection, setDoc, deleteDoc } from 'firebase/firestore'
import { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'

const MyfolderPage = () => {
    const { folderId } = useParams()
    const { currentUser } = useAuthContext()
    const { data: folder, loading: folderLoading } = useGetDoc(`users/${currentUser.uid}/folders`, folderId)
    const { data: reviews, loading: reviewsLoading } = useGetCollection(`users/${currentUser.uid}/reviews`)
    const navigate = useNavigate()
    const [wannaEditFolder, setWannaEditFolder] = useState(false)
    const newFolderNameRef = useRef()

    const reviewsInFolder = reviews.filter((review) => {
        if(review.folder) {
            if(review.folder.id == folderId) {
                return review
            }
        }
        
    })
    
    const handleDeleteFolder = async () => {
        // delete folder from firstore
        const ref = doc(db, `users/${currentUser.uid}/folders`, folder.id)
        await deleteDoc(ref)

        // navigate to my-reviews
        navigate('/my-reviews')
    }

    const handleEditFolderSubmit = (e) => {
        e.preventDefault()

        const ref = doc(db, `users/${currentUser.uid}/folders`, folder.id)

        updateDoc(ref, {name: newFolderNameRef.current.value})

        setWannaEditFolder(false)
    }

    return (
        <div>
            <h1>
                {folder.name}
            </h1>
            {wannaEditFolder && (
                <Form onSubmit={handleEditFolderSubmit}>
                    <Form.Group>
                        <Form.Label>Change name</Form.Label>
                        <Form.Control ref={newFolderNameRef} type='text' />
                        <button type='submit'>Submit</button>
                    </Form.Group>
                </Form>
            )}
            <button onClick={handleDeleteFolder}>Delete folder</button>
            <button onClick={() => setWannaEditFolder(!wannaEditFolder)}>{wannaEditFolder ? 'Cancel' : 'Change name of folder'}</button>
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
