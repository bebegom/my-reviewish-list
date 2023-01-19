import { useRef, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import ErrorMessage from '../components/ErrorMessage'

const SignupPage = () => {
    const emailRef = useRef()
	const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { signup } = useAuthContext()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        // throw error if passwords does not match
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('The passwords does not match')
            return
        }

        // try to create user
        try {
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate('/home')
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <Container>
                {error && (
                    <ErrorMessage msg={error} setError={setError} />
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

                    <Form.Group id="passwordConfirm">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>

                    <Button disabled={loading} type='submit'>Sign up</Button>
                </Form>

                <div className="text-center mt-3">
                    already have an account? <Link to="/">Log in</Link>
                </div>
            </Container>
        </>
    )
}

export default SignupPage
