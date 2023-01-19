import { useEffect } from 'react'
import { useState } from 'react'
import MostActiveUserCard from '../../components/ToplistCard'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'

const MostWantedPage = () => {
    const {data, loading} = useGetCollection('wishlist')
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
                    <h1>Most wanted</h1>
                    {arraysOfItemAndCount && (
                        <>
                            {arraysOfItemAndCount[1].map((i, index) => {
                                if(index < 10) {
                                    return <MostActiveUserCard key={index} wishlist={true} email={i} index={index} arraysOfEmailAndCount={arraysOfItemAndCount} />
                                }
                            })}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MostWantedPage
