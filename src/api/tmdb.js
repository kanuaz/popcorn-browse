const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const POSTER_SIZE = '/w342';
export const BACKDROP_SIZE = '/w1280';

async function request(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('TMDB error');
  return res.json();
}

export const tmdb = {
  getMoviesByCategory(category, page = 1) {
    return request(`/movie/${category}`, { page });
  },

  searchMovies(query, page = 1) {
    return request('/search/movie', { query, page, include_adult: 'false' });
  },

  getMovieDetails(id) {
    return request(`/movie/${id}`, {
      append_to_response: 'credits,images,recommendations,videos',
    });
  },

  getGenres() {
    return request('/genre/movie/list');
  },
};
