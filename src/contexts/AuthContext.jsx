import { createContext, useContext, useState } from 'react'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const AuthContext = createContext()

const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)

    const signup = async (email, password) => {
        console.log('create account with: ', email, password)
		await createUserWithEmailAndPassword(auth, email, password)

		const docRef = doc(db, 'users', auth.currentUser.uid) 
		await setDoc(docRef, {
			email,
		})
	}

    const contextValues = {
		signup,
    }

    return (
		<AuthContext.Provider value={contextValues}>
			{loading ? (
				<div id="initial-loader">
					Loading...
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	)
}

export {
    AuthContextProvider as default,
    useAuthContext,
}