import { useEffect } from 'react'
import { useState } from 'react'
import { Container } from 'react-bootstrap'
import MostActiveUserCard from '../../components/ToplistCard'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'

const MostActiveUserPage = () => {
    const {data, loading} = useGetCollection('reviews')
    const [arraysOfEmailAndCount, setArraysOfEmailAndCount] = useState(null)

    useEffect(() => {
        const arrayOfEmails = data.map((doc) => doc.user_email)
        const result = getOccurrences(arrayOfEmails)
        const re = getSortedOccurrences([result[1], result[0]])
        setArraysOfEmailAndCount(re)
    }, [data])

    return (
        <Container className='my-3'>
            {loading && <p>loading...</p>}
            {data && (
                <>
                    <h1>Most active user</h1>

                    {arraysOfEmailAndCount && (
                        <>
                            {arraysOfEmailAndCount[1].map((email, index) => {
                                if(index < 10) {
                                    return <MostActiveUserCard key={email} email={email} index={index} arraysOfEmailAndCount={arraysOfEmailAndCount} />
                                }
                            })}
                        </>
                    )}
                </>
            )}
        </Container>
    )
}

export default MostActiveUserPage
