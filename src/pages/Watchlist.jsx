import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, getDocs } from '../firebase';
import MovieCard from '../components/MovieCard';

function Watchlist() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const colRef = collection(db, 'watchlists', user.uid, 'movies');
      const snap = await getDocs(colRef);
      const arr = [];
      snap.forEach((doc) => arr.push(doc.data()));
      setMovies(arr);
      setLoading(false);
    };

    load();
  }, [user]);

  if (!user) {
    return (
      <main className="home">
        <h2>My Watchlist</h2>
        <p>Please sign in to see your watchlist.</p>
      </main>
    );
  }

  return (
    <main className="home">
      <h2>My Watchlist</h2>
      {loading && <p className="loading">Loading...</p>}
      {!loading && movies.length === 0 && <p>No movies yet.</p>}

      <div className="movie-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </main>
  );
}

export default Watchlist;
