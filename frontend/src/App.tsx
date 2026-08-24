import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Docs from './components/Docs';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import { auth, githubProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'docs' | 'pricing' | 'blog' | 'blog-post'>('home');
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/blog/')) {
      const slug = path.split('/')[2];
      setCurrentView('blog-post');
      setCurrentSlug(slug);
    } else if (path === '/blog' || path === '/knowledge-hub') {
      setCurrentView('blog');
    } else if (path === '/docs') {
      setCurrentView('docs');
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      setLoading(false);
      
      // Check if there was a pending "pro" plan intent
      if (currentUser && localStorage.getItem('login_intent') === 'pro') {
        localStorage.removeItem('login_intent');
        // Small delay to ensure smooth transition
        setTimeout(() => {
          window.location.href = `https://buy.stripe.com/cNi00jfmxftvedpeAq9R60b?client_reference_id=${currentUser.uid}`;
        }, 500);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (intent?: string) => {
    try {
      setErrorMsg(null);
      if (intent) {
        localStorage.setItem('login_intent', intent);
      }
      await signInWithPopup(auth, githubProvider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/configuration-not-found') {
        setErrorMsg("CRITICAL ERROR: GitHub Authentication is NOT yet fully configured in your Firebase Console.");
      } else {
        setErrorMsg(`Login failed: [${error.code}] ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  const navigate = (view: 'home' | 'docs' | 'pricing' | 'blog' | 'blog-post', slug?: string) => {
    if (view === 'pricing') {
      setCurrentView('home');
      setTimeout(() => {
        const pricingSection = document.getElementById('pricing');
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    setCurrentView(view);
    if (slug) setCurrentSlug(slug);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-muted)' }}>Loading...</div>;
  }

  const logoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '120px', /* Reverted to original as requested */
    cursor: 'pointer'
  };

  const brandLogoStyle: React.CSSProperties = {
    height: '120px', /* Reverted to original as requested */
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
      padding: '0 2rem', /* Removed top/bottom padding to eliminate empty space */
      backgroundColor: 'transparent',
      width: '100%',
      height: '120px', /* Match logo height exactly to avoid gaps */
      zIndex: 10,
      margin: 0 /* No margin at the top */
    }}>
      <div style={logoStyle} onClick={() => navigate('home')}>
        <img src="/logo-v3.png" alt="CyberAgents Logo" style={brandLogoStyle} />
      </div>
      <div style={navLinksStyle}>
        <a style={navLinkStyle} onClick={() => { window.history.pushState({}, '', '/'); navigate('home'); }}>Home</a>
        <a style={navLinkStyle} onClick={() => { window.history.pushState({}, '', '/blog'); navigate('blog'); }}>Knowledge Hub</a>
        <a style={navLinkStyle} onClick={() => { window.history.pushState({}, '', '/docs'); navigate('docs'); }}>Docs</a>
        <a style={navLinkStyle} onClick={() => navigate('pricing')}>Pricing</a>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={user.photoURL || '/logo-v3.png'} alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => handleLogin()}>Login with GitHub</button>
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
      case 'blog-post':
        return (
          <>
            <PageHeader />
            <BlogPost slug={currentSlug!} onNavigate={navigate} />
          </>
        );
      case 'blog':
        return (
          <>
            <PageHeader />
            <BlogList onNavigate={navigate} />
          </>
        );
      case 'docs':
        return (
          <>
            <PageHeader />
            <Docs />
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {errorMsg && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ef4444', color: 'white', padding: '1rem', borderRadius: '8px', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
        </div>
      )}
      <main className="app-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
