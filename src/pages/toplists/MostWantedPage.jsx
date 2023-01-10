import { useEffect } from 'react'
import { useState } from 'react'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'

const MostWantedPage = () => {
    const {data, loading} = useGetCollection('wishlist')
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
                    <h1>Most wanted</h1>
                    {arraysOfItemAndCount && (
                        <>
                            {arraysOfItemAndCount[1].map((i, index) => (
                                <p key={i}>{i} exists in {arraysOfItemAndCount[0][index]} wishlists</p>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default MostWantedPage
