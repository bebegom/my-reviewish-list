import { useParams, useNavigate } from 'react-router-dom'
import ReviewItemCard from '../components/ReviewItemCard'
import { useAuthContext } from '../contexts/AuthContext'
import useGetCollection from '../hooks/useGetCollection'
import useGetDoc from '../hooks/useGetDoc'
import { db } from '../firebase'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import ErrorMessage from "../components/ErrorMessage"

const MyfolderPage = () => {
    const { folderId } = useParams()
    const { currentUser } = useAuthContext()
    const { data: folder, loading: folderLoading } = useGetDoc(`users/${currentUser.uid}/folders`, folderId)
    const { data: reviews, loading: reviewsLoading } = useGetCollection(`users/${currentUser.uid}/reviews`)
    const navigate = useNavigate()
    const [wannaEditFolder, setWannaEditFolder] = useState(false)
    const newFolderNameRef = useRef()
    const [errorOccurred, setErrorOccurred] = useState(null)

    const reviewsInFolder = reviews.filter((review) => {
        if(review.folder) {
            if(review.folder.id == folderId) {
                return review
            }
        }
    })
    
    const handleDeleteFolder = async () => {
        try {
            // delete folder from firstore
            const ref = doc(db, `users/${currentUser.uid}/folders`, folder.id)
            await deleteDoc(ref)

            // navigate to my-reviews
            navigate('/my-reviews')
        } catch (e) {
            setErrorOccurred("Couldn't delete your folder")
        }
    }

    const handleEditFolderSubmit = (e) => {
        e.preventDefault()

        const ref = doc(db, `users/${currentUser.uid}/folders`, folder.id)

        updateDoc(ref, {name: newFolderNameRef.current.value})

        setWannaEditFolder(false)
    }

    return (
        <Container className='my-3'>
            {errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
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
            <div className='btns-container'>
                <button className='btn-secondary' onClick={() => setWannaEditFolder(!wannaEditFolder)}>{wannaEditFolder ? 'Cancel' : 'Change name of folder'}</button>
                <button className='btn-primary' onClick={handleDeleteFolder}>Delete folder</button>
            </div>
            {reviewsInFolder && (
                <section className='grid'>
                    {reviewsInFolder.map(review => (
                        <ReviewItemCard key={review.uid} item={review} />
                    ))}
                </section>
            )}
        </Container>
    )
}

export default MyfolderPage
