import { useParams, useNavigate } from 'react-router-dom'
import { baseIMG, getTvshow } from '../services/tmdbAPI'
import CreateTvshowReviewForm from './CreateTvshowReviewForm'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { db } from '../firebase'
import { useAuthContext } from "../contexts/AuthContext"
import { doc, addDoc, collection, updateDoc } from 'firebase/firestore'

const TvshowCard = ({ tvshow }) => {
    const { tvshowGenreId } = useParams()
    const {data, isLoading, error, isError} = useQuery(['tvshow', tvshow.id], () => getTvshow(tvshow.id))
    const navigate = useNavigate()
    const { currentUser } = useAuthContext()
    const [showCreateReviewForm, setShowCreateReviewForm] = useState(false)

    // const addToWishlist = async () => {
    //     // add tvshow to user's wishlist-collection on firestore
    //     await addDoc(collection(db, `users/${currentUser.uid}/wishlist`), {
    //         ...tvshow,
    //         is_movie: false,
    //         is_tvshow: true,
    //         // api_id: data.id,
    //         // title: data.name,
    //         // image: `${baseIMG}${data.poster_path}`,
    //         // genres: data.genres,
    //         // overview: data.overview,
    //         // number_of_seasons: data.number_of_seasons
    //     }).then(async (cred) => {
    //         const ref = doc(db, `users/${currentUser.uid}/wishlist`, cred.id)
    //         updateDoc(ref, {uid: cred.id})

    //         await addDoc(collection(db, 'wishlist'), {
    //             user_id: currentUser.uid,
    //             user_email: currentUser.email,
    //             is_movie: false,
    //             is_tvshow: true,
    //             ...tvshow,
    //             // api_id: data.id,
    //             // title: data.name,
    //             // image: `${baseIMG}${data.poster_path}`,
    //             // genres: data.genres,
    //             // overview: data.overview,
    //             // number_of_seasons: data.number_of_seasons
    //         }).then((credentials) => {
    //             const ref = doc(db, 'wishlist', credentials.id)
    //             updateDoc(ref, {uid: credentials.id})
    //             updateDoc(ref, {user_wishlist_uid: cred.id})
    //         })
    //     })
    // }

    return (
        <>
        {data && (
            <>
                <div onClick={(e) => {
                    if(e.target.tagName != "BUTTON") {
                        return navigate(`/tvshows/${tvshowGenreId}/${data.id}`)
                    }
                }} className='movie-card' key={data.id}>
                    <img className='poster-img' src={`${baseIMG}${data.poster_path}`} />
                    <div>
                        <h2>{data.name}</h2>
                        {/* <button className='btn-primary' onClick={() => setShowCreateReviewForm(true)}>Add review</button>
                
                        <button onClick={addToWishlist} className='btn-secondary'>Add to wishlist</button> */}
                    </div>
                </div>

                {showCreateReviewForm && <CreateTvshowReviewForm showForm={setShowCreateReviewForm} tvshow={data} />}
            </>
            
        )}
            
        </>
        
    )
}

export default TvshowCard
