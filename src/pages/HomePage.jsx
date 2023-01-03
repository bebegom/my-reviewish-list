import React from 'react'
import { useAuthContext } from '../contexts/AuthContext'

const HomePage = () => {
    const {currentUser} = useAuthContext()
    return (
        <>
            <p>Homepage</p>
            <p>Current user: {currentUser ? currentUser.email : 'null'}</p>
        </>
    )
}

export default HomePage
