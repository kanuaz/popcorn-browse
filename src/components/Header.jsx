import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header({ theme, onToggleTheme }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <span className="logo-icon">🍿</span>
          <span className="logo-text">PopcornBrowse</span>
        </Link>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by movie title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <nav className="header-right">
        <Link
          to="/"
          className={
            location.pathname === '/' ? 'nav-link active' : 'nav-link'
          }
        >
          Movies
        </Link>

        {/* Theme toggle */}
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        <button className="signin-btn" type="button">
          Sign In
        </button>
      </nav>
    </header>
  );
}

export default Header;
