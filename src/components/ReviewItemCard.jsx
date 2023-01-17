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
                                            if (index + 1 == item.genres.length) {
                                                return `${genre.name}`
                                            } else {
                                                return `${genre.name} - `
                                            }
                                        })}
                                    </p>
                                </div>
                                    <Rating myRating={item.my_rating} />
                                    {/* <button className="btn-primary full-width" as={Link} to={`/my-reviews/${item.uid}`}>Details</button> */}
                            </div>
                        </div>
    )
}

export default ReviewItemCard
