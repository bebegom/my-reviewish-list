import { useRef, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

const LoginPage = () => {
    const emailRef = useRef()
	const passwordRef = useRef()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { login, currentUser } = useAuthContext()
    // console.log('logging ', currentUser.email)
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        // try to log in
        try{
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate('/home')
        } catch(e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Container>
                <p>Current user: {currentUser ? currentUser.email : 'null'}</p>
                {error && (
                    <div>ERROR: {error}</div>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' ref={emailRef} required />
                    </Form.Group>

                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>

                    <Button disabled={loading} type='submit'>Log in</Button>
                </Form>

                <div className="text-center mt-3">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </Container>
        </>
    )
}

export default LoginPage
