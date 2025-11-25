import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tmdb } from '../api/tmdb';
import Tabs from '../components/Tabs';
import MovieCard from '../components/MovieCard';

function Home() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const [category, setCategory] = useState('popular');
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('Popular');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');

  const bottomRef = useRef(null);

  useEffect(() => {
    async function loadGenres() {
      try {
        const data = await tmdb.getGenres();
        setGenres(data.genres || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadGenres();
  }, []);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [category, search]);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setLoading(true);
      try {
        let data;
        if (search.trim()) {
          data = await tmdb.searchMovies(search, page);
          if (page === 1) {
            setTitle(`Results for "${search}"`);
          }
        } else {
          data = await tmdb.getMoviesByCategory(category, page);
          if (page === 1) {
            const pretty =
              category === 'now_playing'
                ? 'Now playing'
                : category === 'top_rated'
                ? 'Top rated'
                : category.charAt(0).toUpperCase() + category.slice(1);
            setTitle(pretty);
          }
        }

        if (!isCancelled) {
          const newResults = data.results || [];
          setMovies((prev) => [...prev, ...newResults]);
          setHasMore(data.page < data.total_pages);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [category, search, page]);

  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const filteredMovies =
    selectedGenre === 'all'
      ? movies
      : movies.filter((m) =>
          (m.genre_ids || []).includes(Number(selectedGenre))
        );

  return (
    <main className="home">
      {/* Tabs only when not searching */}
      {!search && (
        <Tabs active={category} onChange={(cat) => setCategory(cat)} />
      )}

      <div className="filters-row">
        <h2 className="section-title">{title}</h2>

        <div className="genre-filter">
          <label htmlFor="genre-select">Genre:</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="all">All</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="movie-grid">
        {filteredMovies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      {/* invisible trigger for infinite scroll */}
      <div ref={bottomRef} style={{ height: '1px' }} />

      {loading && <p className="loading">Loading...</p>}
      {!loading && filteredMovies.length === 0 && <p>No movies found.</p>}
    </main>
  );
}

export default Home;
