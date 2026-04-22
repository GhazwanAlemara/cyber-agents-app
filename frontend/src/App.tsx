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

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '80px',
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
    gap: '1.5rem',
    alignItems: 'center'
  };

  const navLinkStyle: React.CSSProperties = {
    color: '#9aa0a6',
    fontWeight: 500,
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    cursor: 'pointer',
    textDecoration: 'none'
  };

  // Inline header passed to pages
  const PageHeader = () => (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 2rem',
      backgroundColor: 'transparent',
      width: '100%',
      zIndex: 10
    }}>
      <div style={logoStyle} onClick={() => navigate('home')}>
        <img src="/logo-v3.png" alt="CyberAgents Logo" style={brandLogoStyle} />
      </div>
      <div style={navLinksStyle}>
        <a style={navLinkStyle} onClick={() => navigate('home')}>Home</a>
        <a style={navLinkStyle} onClick={() => navigate('docs')}>Docs</a>
        <a style={navLinkStyle} onClick={() => navigate('pricing')}>Pricing</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={user.photoURL || '/logo-v3.png'} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={handleLogin}>Login with GitHub</button>
        )}
      </div>
    </header>
  );

  const renderContent = () => {
    if (user && currentView === 'home') {
      return (
        <>
          <PageHeader />
          <Dashboard user={user} />
        </>
      );
    }

    switch (currentView) {
      case 'docs':
        return (
          <>
            <PageHeader />
            <Docs />
          </>
        );
      case 'pricing':
        return (
          <>
            <PageHeader />
            <Pricing onLogin={handleLogin} />
          </>
        );
      case 'home':
      default:
        return (
          <>
            <PageHeader />
            <Landing onLogin={handleLogin} onNavigate={navigate} />
          </>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className="app-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
