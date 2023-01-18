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

const MyReviewsPage = () => {
    const { currentUser } = useAuthContext()
    const { data, loading } = useGetCollection(`users/${currentUser.uid}/reviews`)
    const { data: folders, loading: foldersLoading } = useGetCollection(`users/${currentUser.uid}/folders`)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [showTvshowForm, setShowTvshowForm] = useState(false)
    const [wannaCreateNewFolder, setWannaCreateNewFolder] = useState(false)
    const newFolderNameRef = useRef()
    const navigate = useNavigate()

    // const createNewFolder = () =>{

    // }

    const handleNewFolderSubmit = async (e) => {
        e.preventDefault()

        await addDoc(collection( db, `users/${currentUser.uid}/folders`), {
            name: newFolderNameRef.current.value,
        }).then(async (cred) => {
            const ref = doc(db, `users/${currentUser.uid}/folders`, cred.id)
            updateDoc(ref, {uid: cred.id})
        })

        setWannaCreateNewFolder(false)
        
        console.log('folder created')
    }

    return (
        <>
            {loading && <p>loading...</p>}

            {data && (
                <>
                    <h1>My reviews</h1>
                    <button onClick={() => setShowMovieForm(true)} className="btn-primary">Create new movie-review</button>
                    <button onClick={() => setShowTvshowForm(true)} className="btn-primary">Create new tvshow-review</button>
                    <button onClick={() => setWannaCreateNewFolder(!wannaCreateNewFolder)}>{wannaCreateNewFolder ? 'Cancel' : 'Create new folder'}</button>

                    {wannaCreateNewFolder && (
                        <Form onSubmit={handleNewFolderSubmit}>
                            <Form.Control type='text' placeholder='Name your folder' ref={newFolderNameRef} />
                            <button type="submit">Create</button>
                        </Form>
                    )}

                    <h2>Folders</h2>
                    {folders.map(folder => (
                            <div onClick={() => navigate(`/my-reviews/folders/${folder.uid}`)} key={folder.uid}>{folder.name}</div>
                    ))}
                    
                    <h2>All reviews</h2>
                    {data.map(item => {
                        if(item.is_movie || item.is_tvshow) {
                            return <ReviewItemCard item={item} key={item.id} />
                        }
                    })}
                </>
            )}

            {showMovieForm && <CreateMovieReviewForm showForm={setShowMovieForm} />}
            {showTvshowForm && <CreateTvshowReviewForm showForm={setShowTvshowForm} />}
        </>
    )
}

export default MyReviewsPage
