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
      console.error("Login failed:", error);
      if (error.code === 'auth/configuration-not-found') {
        alert("CRITICAL ERROR: GitHub Authentication is NOT yet fully configured in your Firebase Console.");
      } else {
        alert(`Login failed: [${error.code}] ${error.message}`);
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

  const navbarStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '100px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #334155',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 9999999,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  };

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    cursor: 'pointer'
  };

  const brandLogoStyle: React.CSSProperties = {
    height: '80px',
    width: 'auto',
    objectFit: 'contain',
    display: 'block'
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1.5rem'
  };

  const navLinkStyle: React.CSSProperties = {
    color: '#475569',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none'
  };

  return (
    <>
      <header style={navbarStyle}>
        <div className="logo" onClick={() => navigate('home')} style={logoStyle}>
          <img src="/logo.png" alt="CyberAgents Logo" style={brandLogoStyle} />
        </div>
        <div className="nav-links" style={navLinksStyle}>
          <a style={navLinkStyle} onClick={() => navigate('home')}>Home</a>
          <a style={navLinkStyle} onClick={() => navigate('docs')}>Docs</a>
          <a style={navLinkStyle} onClick={() => navigate('pricing')}>Pricing</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={user.photoURL || '/logo.png'} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #334155' }} />
              <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleLogin}>Login with GitHub</button>
          )}
        </div>
      </header>

      <main style={{ paddingTop: '100px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {renderContent()}
      </main>
    </>
  );
  }
  export default App;
