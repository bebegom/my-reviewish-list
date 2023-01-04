import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const AuthContext = createContext()

const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const signup = async (email, password) => {
		await createUserWithEmailAndPassword(auth, email, password)

		const docRef = doc(db, 'users', auth.currentUser.uid) 
		await setDoc(docRef, {
			email,
		})
	}

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    useEffect(() => {
        // listen for auth-state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setLoading(false)
        })
        
        return unsubscribe
    }, [])

    const contextValues = {
        currentUser,
		signup,
        login,
        logout,
    }

    return (
		<AuthContext.Provider value={contextValues}>
			{loading ? (<p>loading...</p>) : (children)}
		</AuthContext.Provider>
	)
}

export {
    AuthContextProvider as default,
    useAuthContext,
}