import { useEffect, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import ErrorMessage from "../components/ErrorMessage"

const LogoutPage = () => {
    const { logout } = useAuthContext()
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    useEffect(()=> {
        setError(null)
        const logoutUser = async () => {
            try {
                await logout()
                navigate('/')
            } catch (e) {
                setError(e.message)
            }
        }
        logoutUser()
    }, [])

    return (
        <Container>
            {error
                ? < ErrorMessage msg={error} setError={setError} />
                : <p>Logging out...</p>
            }
        </Container>
    )
}

export default LogoutPage
