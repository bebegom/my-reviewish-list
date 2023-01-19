import React from 'react'

const ErrorMessage = ({ msg, setError }) => {
    return (
        <div className='error'>
            <h1>Something went left</h1>
            <p className='my-3'>{msg}</p>
            <div className='d-flex justify-content-end'>
                <button onClick={() => setError(null)} className='btn-error '>OK</button>

            </div>
        </div>
    )
}

export default ErrorMessage
