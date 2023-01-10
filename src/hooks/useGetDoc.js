import {useState, useEffect} from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const useGetDoc = (collection, id) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // get reference to document
        const ref = doc(db, collection, id)

        // subscribe to changes on the document
        const unSubscribe = onSnapshot(ref, (snapshot) => {
            setData({
                id,     // samma som att skriva id: snapshot.id
                ...snapshot.data(),
            })
            setLoading(false)
        })

        return unSubscribe
    }, [])

    return {
        data,
        loading,
    }
}

export default useGetDoc