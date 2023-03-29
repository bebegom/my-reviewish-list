import { useEffect } from 'react'
import { useState } from 'react'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'
import MostActiveUserCard from '../../components/ToplistCard'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const MostWatchedPage = () => {
    const navigate = useNavigate()
    const {data, loading} = useGetCollection('reviews')
    const [arraysOfItemAndCount, setArraysOfItemAndCount] = useState(null)

    useEffect(() => {
        const arrayOfTitles = data.map((doc) => doc.title ? `${doc.title}*movie*${doc.id}` : `${doc.name}*tvshow*${doc.id}`)
        const result = getOccurrences(arrayOfTitles)
        const re = getSortedOccurrences([result[1], result[0]])
        setArraysOfItemAndCount(re)
    }, [data])

    return (
        <Container className='my-3'>
            {loading && <p>loading...</p>}
            {data && (
                <>
                    <h1>Most watched</h1>
                    {arraysOfItemAndCount && (
                        <>
                            {arraysOfItemAndCount[1].map((i, index) => {
                                const lastIndex = i.lastIndexOf('*')
                                const firstIndex = i.indexOf('*')
                                const iId = i.substring(lastIndex + 1, i.length)
                                const type = i.substring(firstIndex + 1, lastIndex)

                                if(index < 10) {
                                    return <div onClick={() => navigate(`/${type == 'movie' ? 'movies' : 'tvshows'}/${iId}`)} ><MostActiveUserCard key={index} email={i.substring(0, firstIndex)} index={index} arraysOfEmailAndCount={arraysOfItemAndCount} /></div>
                                }
                            })}
                        </>
                    )}
                </>
            )}
        </Container>
    )
}

export default MostWatchedPage
