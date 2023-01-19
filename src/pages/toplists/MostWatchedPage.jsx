import { useEffect } from 'react'
import { useState } from 'react'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'
import MostActiveUserCard from '../../components/ToplistCard'

const MostWatchedPage = () => {
    const {data, loading} = useGetCollection('reviews')
    const [arraysOfItemAndCount, setArraysOfItemAndCount] = useState(null)

    useEffect(() => {
        const arrayOfTitles = data.map((doc) => doc.title || doc.name)
        const result = getOccurrences(arrayOfTitles)
        const re = getSortedOccurrences([result[1], result[0]])
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
                            {arraysOfItemAndCount[1].map((i, index) => {
                                if(index < 10) {
                                    return <MostActiveUserCard key={index} email={i} index={index} arraysOfEmailAndCount={arraysOfItemAndCount} />
                                }
                            })}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MostWatchedPage
