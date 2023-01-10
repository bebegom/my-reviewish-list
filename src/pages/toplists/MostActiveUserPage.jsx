import { useEffect } from 'react'
import { useState } from 'react'
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
        console.log(re)
        setArraysOfEmailAndCount(re)
    }, [data])


    return (
        <div>
            {loading && <p>loading...</p>}
            {data && (
                <>
                    <h1>Most active user</h1>

                    {arraysOfEmailAndCount && (
                        <>
                            {arraysOfEmailAndCount[1].map((i, index) => (
                                <p key={i}>{i} with {arraysOfEmailAndCount[0][index]} reviews made</p>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MostActiveUserPage
