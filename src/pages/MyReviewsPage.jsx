import useGetCollection from "../hooks/useGetCollection"
import { useAuthContext } from "../contexts/AuthContext"
import ReviewItemCard from "../components/ReviewItemCard"
import CreateMovieReviewForm from "../components/CreateMovieReviewForm"
import CreateTvshowReviewForm from "../components/CreateTvshowReviewForm"
import { useRef, useState } from "react"
import Form from 'react-bootstrap/Form'
import { addDoc, doc, collection, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from "react-router-dom"
import ErrorMessage from "../components/ErrorMessage"
import { Container } from "react-bootstrap"

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)
    const { data: folders, loading: foldersLoading } = useGetCollection(`users/${currentUser.uid}/folders`)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [showTvshowForm, setShowTvshowForm] = useState(false)
    const [wannaCreateNewFolder, setWannaCreateNewFolder] = useState(false)
    const newFolderNameRef = useRef()
    const navigate = useNavigate()
    const [errorOccurred, setErrorOccurred] = useState(null)

    const handleNewFolderSubmit = async (e) => {
        e.preventDefault()

        if(newFolderNameRef.current.value == '') {
            setErrorOccurred("Please enter a name for your folder")
            return
        }

        try {
            await addDoc(collection( db, `users/${currentUser.uid}/folders`), {
                name: newFolderNameRef.current.value,
            }).then(async (cred) => {
                const ref = doc(db, `users/${currentUser.uid}/folders`, cred.id)
                updateDoc(ref, {uid: cred.id})
            })
            setWannaCreateNewFolder(false)
        } catch (e) {
            setErrorOccurred("Couldn't create folder")
        }
    }

    return (
        <Container className="my-3">
            {loading && <p>loading...</p>}
            {errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
            {data && (
                <>
                    {/* <h1>My reviews</h1> */}
                    <div className="btns-container">
                        <button onClick={() => setShowMovieForm(true)} className="btn-primary">Create new movie-review</button>
                        <button onClick={() => setShowTvshowForm(true)} className="btn-primary">Create new tvshow-review</button>
                        <button onClick={() => setWannaCreateNewFolder(!wannaCreateNewFolder)} className="btn-secondary">{wannaCreateNewFolder ? 'Cancel' : 'Create new folder'}</button>
                    </div>

                    {wannaCreateNewFolder && (
                        <Form onSubmit={handleNewFolderSubmit}>
                            <Form.Control type='text' placeholder='Name your folder' ref={newFolderNameRef} />
                            <button type="submit">Create</button>
                        </Form>
                    )}

                    <h2>Folders</h2>
                    <section className="folders-section">
                    {folders.map(folder => (
                            <div className="folder-card p-3" onClick={() => navigate(`/my-reviews/folders/${folder.uid}`)} key={folder.uid}>
                                <h5>
                                    {folder.name}
                                </h5>
                            </div>
                    ))}
                    </section>
                    
                    
                    <h2>All reviews</h2>
                    <section className="grid">
                        {data.map(item => {
                            if(item.is_movie || item.is_tvshow) {
                                return <ReviewItemCard item={item} key={item.id} />
                            }
                        })}
                    </section>
                    
                </>
            )}

            {showMovieForm && <CreateMovieReviewForm showForm={setShowMovieForm} />}
            {showTvshowForm && <CreateTvshowReviewForm showForm={setShowTvshowForm} />}
        </Container>
    )
}

export default MyReviewsPage
