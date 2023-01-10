import { useEffect } from 'react'
import { useState } from 'react'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'

const MostWatchedPage = () => {
    const {data, loading} = useGetCollection('reviews')
    const [arraysOfItemAndCount, setArraysOfItemAndCount] = useState(null)

    useEffect(() => {
        const arrayOfTitles = data.map((doc) => doc.title)

        const result = getOccurrences(arrayOfTitles)

        const re = getSortedOccurrences([result[1], result[0]])
        console.log(re)
        setArraysOfItemAndCount(re)
    }, [data])

    return (
        <div>
            {loading && <p>loading...</p>}
            {data && (
                <>
                    <h1>Most watched</h1>

                    {arraysOfItemAndCount && (
                        <>
                            {arraysOfItemAndCount[1].map((i, index) => (
                                <p key={i}>{i} with {arraysOfItemAndCount[0][index]} reviews made</p>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MostWatchedPage
