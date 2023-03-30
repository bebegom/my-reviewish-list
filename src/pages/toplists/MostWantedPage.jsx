import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import MostActiveUserCard from '../../components/ToplistCard'
import getOccurrences from '../../helpers/getOccurences'
import getSortedOccurrences from '../../helpers/getSortedOccurrences'
import useGetCollection from '../../hooks/useGetCollection'

const MostWantedPage = () => {
    const navigate = useNavigate()
    const {data, loading} = useGetCollection('wishlist')
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
                    <h1>Most wanted</h1>
                    {arraysOfItemAndCount && (
                        <>
                            {arraysOfItemAndCount[1].map((i, index) => {
                                const lastIndex = i.lastIndexOf('*')
                                const firstIndex = i.indexOf('*')
                                const iId = i.substring(lastIndex + 1, i.length)
                                const type = i.substring(firstIndex + 1, lastIndex)
                                if(index < 10) {
                                    return <div key={index} onClick={() => navigate(`/${type == 'movie' ? 'movies' : 'tvshows'}/${iId}`)}><MostActiveUserCard wishlist={true} email={i.substring(0, firstIndex)} index={index} arraysOfEmailAndCount={arraysOfItemAndCount} /></div>
                                }
                            })}
                        </>
                    )}
                </>
            )}
        </Container>
    )
}

export default MostWantedPage
