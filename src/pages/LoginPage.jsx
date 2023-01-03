import {useRef, useState} from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link, useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const emailRef = useRef()
	const passwordRef = useRef()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        console.log('submitting')

        // 
    }

    return (
        <Container>
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
    )
}

export default LoginPage
