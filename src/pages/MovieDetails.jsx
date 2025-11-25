import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  tmdb,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE,
} from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';
import { db, doc, setDoc, deleteDoc, getDoc } from '../firebase';
import { useToast } from '../context/ToastContext';
import MovieDetailsSkeleton from '../components/MovieDetailsSkeleton';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { showToast } = useToast();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const [altRecommendations, setAltRecommendations] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await tmdb.getMovieDetails(id);

        if (!cancelled) {
          setMovie(data);

          if (!data.recommendations?.results?.length) {
            const popular = await tmdb.getMoviesByCategory('popular', 1);
            if (!cancelled) {
              setAltRecommendations(popular.results.slice(0, 8));
            }
          } else {
            setAltRecommendations([]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!user || !movie) {
      setIsInWatchlist(false);
      return;
    }

    const checkWatchlist = async () => {
      const ref = doc(db, 'watchlists', user.uid, 'movies', String(movie.id));
      const snap = await getDoc(ref);
      setIsInWatchlist(snap.exists());
    };

    checkWatchlist();
  }, [user, movie]);

  const toggleWatchlist = async () => {
    if (!user) {
      showToast('Please sign in to use watchlist.', 'error');
      return;
    }
    if (!movie) return;

    setWatchlistLoading(true);
    try {
      const ref = doc(db, 'watchlists', user.uid, 'movies', String(movie.id));
      if (isInWatchlist) {
        await deleteDoc(ref);
        setIsInWatchlist(false);
        showToast('Removed from watchlist', 'info');
      } else {
        await setDoc(ref, {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          genre_ids: (movie.genres || []).map((g) => g.id),
          addedAt: Date.now(),
        });
        setIsInWatchlist(true);
        showToast('Added to watchlist', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Something went wrong.', 'error');
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) return <MovieDetailsSkeleton />;
  if (!movie) return <p className="loading">Movie not found.</p>;

  const backdrop = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}`
    : null;

  const poster = movie.poster_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
    : null;

  const rating = movie.vote_average?.toFixed(3);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  let trailer = null;
  if (movie.videos?.results?.length) {
    const vids = movie.videos.results;
    trailer =
      vids.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer'
      ) ||
      vids.find(
        (v) => v.site === 'YouTube' && v.type === 'Teaser'
      ) ||
      vids.find((v) => v.site === 'YouTube') ||
      vids[0];
  }

  const backdrops = movie.images?.backdrops || [];
  const posters = movie.images?.posters || [];
  const galleryImages = backdrops.length ? backdrops : posters;

  const recs =
    movie.recommendations?.results?.length
      ? movie.recommendations.results
      : altRecommendations;

  const similar =
    movie.similar?.results?.length ? movie.similar.results.slice(0, 8) : [];

  return (
    <div className="movie-page">
      {backdrop && (
        <div
          className="backdrop"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      <section className="movie-hero">
        {poster && (
          <div className="hero-poster">
            <img src={poster} alt={movie.title} />
          </div>
        )}
        <div className="hero-info">
          <h1>{movie.title}</h1>
          <button
            className="watchlist-btn"
            onClick={toggleWatchlist}
            disabled={watchlistLoading}
          >
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to my Watchlist'}
          </button>
          <p className="overview">{movie.overview}</p>
          <div className="genres">
            {movie.genres?.map((g) => (
              <span key={g.id} className="genre-chip">
                {g.name}
              </span>
            ))}
          </div>
          {rating && <div className="rating-circle">{rating}</div>}
          <div className="meta-row">
            <span>Release date: {movie.release_date}</span>
            <span>Duration: {runtime}</span>
            <span>Budget: ${movie.budget?.toLocaleString() || 0}</span>
          </div>
        </div>
      </section>

      {trailer ? (
        <section className="trailer-section">
          <h2>Trailer</h2>
          <div className="trailer-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      ) : (
        <section className="trailer-section">
          <h2>Trailer</h2>
          <p>No trailer available for this title.</p>
        </section>
      )}

      <section className="actors-section">
        <h2>Actors</h2>
        <div className="actors-list">
          {movie.credits?.cast?.slice(0, 10).map((actor) => (
            <div
              key={actor.cast_id || actor.credit_id || actor.id}
              className="actor-card"
            >
              <img
                src={
                  actor.profile_path
                    ? `${IMAGE_BASE_URL}/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Image'
                }
                alt={actor.name}
              />
              <div className="actor-names">
                <strong>{actor.name}</strong>
                <span>{actor.character}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="gallery-section">
        <h2>Gallery</h2>
        {galleryImages.length ? (
          <div className="gallery-strip">
            {galleryImages.slice(0, 10).map((img) => (
              <img
                key={img.file_path}
                src={`${IMAGE_BASE_URL}/w780${img.file_path}`}
                alt="Backdrop"
                className="gallery-image"
              />
            ))}
          </div>
        ) : (
          <p>No gallery images available.</p>
        )}
      </section>

      <section className="recommendations-section">
        <h2>Recommendations</h2>
        {recs?.length ? (
          <div className="movie-grid">
            {recs.slice(0, 8).map((rec) => (
              <MovieCard key={rec.id} movie={rec} />
            ))}
          </div>
        ) : (
          <p>No recommendations available.</p>
        )}
      </section>

      {similar.length > 0 && (
        <section className="recommendations-section">
          <h2>Similar Movies</h2>
          <div className="movie-grid">
            {similar.map((rec) => (
              <MovieCard key={rec.id} movie={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MovieDetails;
