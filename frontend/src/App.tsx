import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import { auth, githubProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/operation-not-allowed') {
        alert("GitHub login is not enabled in the Firebase Console yet. Please go to Firebase Authentication -> Sign-in Method and enable GitHub.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <img src="/logo.png" alt="CyberAgents Logo" className="brand-logo" />
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#oss">Open Source</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={user.photoURL || '/logo.png'} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border)' }} />
              <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleLogin}>Login with GitHub</button>
          )}
        </div>
      </nav>

      {user ? <Dashboard user={user} /> : <Landing onLogin={handleLogin} />}
    </div>
  );
}

export default App;
