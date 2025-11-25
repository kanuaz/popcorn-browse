import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Header({ theme, onToggleTheme }) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, signInWithGoogle, signOutUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenuAndNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
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

        <Link
          to="/watchlist"
          className={
            location.pathname === '/watchlist'
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Watchlist
        </Link>

        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        {user ? (
          <div className="user-menu-container">
            <button
              type="button"
              className="user-menu-toggle"
              onClick={toggleMenu}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-fallback">
                  {(user.displayName || user.email || 'U')[0]
                    .toUpperCase()}
                </div>
              )}
              <span className="user-name-short">
                {user.displayName || user.email}
              </span>
            </button>

            {menuOpen && (
              <div className="user-menu">
                <button
                  type="button"
                  onClick={() => closeMenuAndNavigate('/account')}
                >
                  My Account
                </button>
                <button
                  type="button"
                  onClick={() => closeMenuAndNavigate('/watchlist')}
                >
                  My Watchlist
                </button>
                <button
                  type="button"
                  onClick={signOutUser}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="signin-btn"
            type="button"
            onClick={signInWithGoogle}
          >
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;
