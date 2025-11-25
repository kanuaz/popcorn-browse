import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import Account from './pages/Account';

function App() {
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`app app-${theme}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}

export default App;
