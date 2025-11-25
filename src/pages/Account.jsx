import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, collection, getDocs } from '../firebase';

function Account() {
  const { user } = useAuth();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const colRef = collection(db, 'watchlists', user.uid, 'movies');
      const snap = await getDocs(colRef);
      setWatchlistCount(snap.size);
      setLoading(false);
    };

    load();
  }, [user]);

  if (!user) {
    return (
      <main className="home">
        <h2>My Account</h2>
        <p>Please sign in to view your account.</p>
      </main>
    );
  }

  return (
    <main className="home account-page">
      <h2>My Account</h2>
      <div className="account-card">
        <div className="account-avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} />
          ) : (
            <div className="user-avatar-fallback account-avatar-fallback">
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="account-info">
          <h3>{user.displayName || 'Unnamed User'}</h3>
          <p>Email: {user.email}</p>
          <p>
            Watchlist movies:{' '}
            {loading ? 'Loading...' : watchlistCount}
          </p>
        </div>
      </div>
    </main>
  );
}

export default Account;
