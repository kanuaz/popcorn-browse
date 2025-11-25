import { Link } from 'react-router-dom';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../api/tmdb';

function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
    : 'https://via.placeholder.com/342x513?text=No+Image';

  const rating = movie.vote_average?.toFixed(1);

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="poster-wrapper">
        <img src={poster} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-genres">{movie.release_date?.slice(0, 4)}</p>
        {rating && <span className="rating-badge">{rating}</span>}
      </div>
    </Link>
  );
}

export default MovieCard;
