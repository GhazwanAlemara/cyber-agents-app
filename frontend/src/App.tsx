import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Docs from './components/Docs';
import Pricing from './components/Pricing';
import { auth, githubProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'docs' | 'pricing'>('home');

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
    setCurrentView('home');
  };

  const navigate = (view: 'home' | 'docs' | 'pricing') => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  // Determine what to render based on auth state and current view
  const renderContent = () => {
    if (user && currentView === 'home') {
      return <Dashboard user={user} />;
    }
    
    switch (currentView) {
      case 'docs':
        return <Docs />;
      case 'pricing':
        return <Pricing onLogin={handleLogin} />;
      case 'home':
      default:
        return <Landing onLogin={handleLogin} onNavigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('home')}>
          <img src="/logo.png" alt="CyberAgents Logo" className="brand-logo" />
        </div>
        <div className="nav-links">
          <a onClick={() => navigate('home')}>Home</a>
          <a onClick={() => navigate('docs')}>Docs</a>
          <a onClick={() => navigate('pricing')}>Pricing</a>
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

      {renderContent()}
    </div>
  );
}

export default App;
