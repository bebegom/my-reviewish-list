import React from 'react'
import Container from 'react-bootstrap/Container'
import { useNavigate } from 'react-router-dom'

const CardLink = ({ endpoint, icon, text }) => {
    const navigate = useNavigate()

    return (
        <Container onClick={() => navigate(endpoint)} className='card-link'>
            <img src={icon} alt="icon" />
            <h3>{text}</h3>
        </Container>
    )
}

export default CardLink
