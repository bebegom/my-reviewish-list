import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useRef } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import useGetCollection from '../hooks/useGetCollection'
import { addDoc, doc, collection, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../firebase'
import ErrorMessage from './ErrorMessage'

const EmailToShareWithInput = ({ setWannaShare, review }) => {
    const emailRef = useRef()
    const { currentUser } = useAuthContext()
    const { data: users, loading: usersLoading } = useGetCollection('users')
    const [loading, setLoading] = useState(false)
    const [errorOccurred, setErrorOccurred] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // find user with email in firestore
            const userToSendTo = users.find(user => user.email == emailRef.current.value)

            // add new doc to the collection 'shared with me' for the other user
            await addDoc(collection(db, `users/${userToSendTo.id}/received`), {
                ...review,
                seen: false,
                from_user: currentUser.email
            }).then((cred) => {
                const ref = doc(db, `users/${userToSendTo.id}/received`, cred.id)
                updateDoc(ref, {received_uid: cred.id})
            })

            setWannaShare(false)
        } catch (e) {
            setErrorOccurred("Couldn't send the review")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='lightbox h-100' onClick={(e) => {
            if(e.target.classList.contains('lightbox')) {
                setWannaShare(false)
            }
        }}>
            {errorOccurred && <ErrorMessage msg={errorOccurred} setError={setErrorOccurred} />}
            <div className='lightbox-content p-3'>
                <Form onSubmit={(e)=> handleSubmit(e)}>
                    <Form.Group id='email'>
                        <Form.Label>Who you wanna send to</Form.Label>
                        <Form.Control placeholder='example@gmail.com' ref={emailRef} type='email' required />
                    </Form.Group>
                    <Button className='mt-3' disabled={loading} type='submit'>Send</Button>
                </Form>
            </div>
        </div>
    )
}

export default EmailToShareWithInput
