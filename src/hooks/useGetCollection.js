import {useState, useEffect} from 'react'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const useGetCollection = (usersCollection, ...queryConstraints) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const ref = collection(db, usersCollection)

        const orderedList = query(ref, ...queryConstraints)

        const unsubscribe = onSnapshot(orderedList, (snapshot) => {
            const docs = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                }
            })

            setData(docs)
            setLoading(false)
        })

        return unsubscribe
    }, [])

    return {
        data, 
        loading,
    }

}

export default useGetCollection