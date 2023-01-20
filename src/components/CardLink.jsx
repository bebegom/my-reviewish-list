import React from 'react'
import { useNavigate } from 'react-router-dom'

const CardLink = ({ endpoint, icon = null, text }) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(endpoint)} className='card-link'>
            {icon && <img src={`${icon}`} alt="icon" />}
            <h3>{text}</h3>
        </div>
    )
}

export default CardLink
