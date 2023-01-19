import Rating from '../components/Rating'
import { useNavigate } from "react-router-dom"
import { baseIMG } from '../services/tmdbAPI'

const ReviewItemCard = ({ item }) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/my-reviews/${item.uid}`)} className="review-card-item" key={item.uid}>
                            {item.poster_path && <img className="poster-img" src={`${baseIMG}${item.poster_path}`} alt='poster' width='100px'/>}
                            <div className="review-card-item-overview">
                                <div className="review-card-item-info">
                                    <h2>{item.is_movie ? item.title : item.name}</h2>
                                    <p className="p-small">
                                        {item.genres.map((genre, index) => {
                                            if(item.genres[index].name == '') {
                                                return
                                            } else if (index + 1 == item.genres.length || item.genres[index + 1].name == '') {
                                                return `${genre.name}`
                                            } else {
                                                return `${genre.name} - `
                                            }
                                        })}
                                    </p>
                                </div>
                                    <Rating myRating={item.my_rating} />
                            </div>
                        </div>
    )
}

export default ReviewItemCard
