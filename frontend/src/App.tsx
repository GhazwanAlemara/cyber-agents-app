import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Docs from './components/Docs';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Contact from './components/Contact';
import AuthModal from './components/AuthModal';
import { auth, githubProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'docs' | 'pricing' | 'blog' | 'blog-post' | 'contact'>('home');
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loginIntent, setLoginIntent] = useState<string | null>(null);

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
    } else if (path === '/contact') {
      setCurrentView('contact');
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser && (path === '/' || path === '')) {
         setCurrentView(prev => prev === 'home' ? 'dashboard' : prev);
      }
      
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

  const handleLogin = (intent?: string) => {
    setErrorMsg(null);
    setLoginIntent(intent || null);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  const navigate = (view: 'home' | 'dashboard' | 'docs' | 'pricing' | 'blog' | 'blog-post' | 'contact', slug?: string) => {
    setMobileMenuOpen(false);
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

  // Inline header passed to pages
  const PageHeader = () => (
    <header className="page-header">
      <div className="logo" onClick={() => navigate('home')}>
        <img src="/logo-v3.png" alt="CyberAgents Logo" className="brand-logo" />
      </div>

      {/* Desktop Navigation Links */}
      <nav className="nav-links">
        <a className="nav-link-item" onClick={() => { window.history.pushState({}, '', '/'); navigate('home'); }}>Home</a>
        <a className="nav-link-item" onClick={() => { window.history.pushState({}, '', '/blog'); navigate('blog'); }}>Knowledge Hub</a>
        <a className="nav-link-item" onClick={() => { window.history.pushState({}, '', '/docs'); navigate('docs'); }}>Docs</a>
        <a className="nav-link-item" onClick={() => { window.history.pushState({}, '', '/contact'); navigate('contact'); }}>Contact</a>
        <a className="nav-link-item" onClick={() => navigate('pricing')}>Pricing</a>
        <a href="https://supernova.cool" target="_blank" rel="noopener noreferrer" className="nav-link-item" style={{ color: '#ff48b0', fontWeight: 600 }}>Supernova ↗</a>
        {user && <a className="nav-link-item" onClick={() => navigate('dashboard')}>Dashboard</a>}
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="auth-buttons">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => handleLogin()}>Sign In</button>
        )}
      </div>

      {/* Mobile Hamburger Toggle Button */}
      <button 
        className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>

      {/* Mobile Drawer Overlay / Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            <a className="mobile-nav-item" onClick={() => { window.history.pushState({}, '', '/'); navigate('home'); }}>
              Home
            </a>
            <a className="mobile-nav-item" onClick={() => { window.history.pushState({}, '', '/blog'); navigate('blog'); }}>
              Knowledge Hub
            </a>
            <a className="mobile-nav-item" onClick={() => { window.history.pushState({}, '', '/docs'); navigate('docs'); }}>
              Docs
            </a>
            <a className="mobile-nav-item" onClick={() => { window.history.pushState({}, '', '/contact'); navigate('contact'); }}>
              Contact
            </a>
            <a className="mobile-nav-item" onClick={() => navigate('pricing')}>
              Pricing
            </a>
            <a href="https://supernova.cool" target="_blank" rel="noopener noreferrer" className="mobile-nav-item" style={{ color: '#ff48b0', fontWeight: 600 }}>
              Supernova MCP Gateway ↗
            </a>
            {user && (
              <a className="mobile-nav-item" onClick={() => navigate('dashboard')}>
                Dashboard
              </a>
            )}
          </nav>

          <div className="mobile-auth-section">
            {user ? (
              <div className="mobile-user-profile">
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{user.displayName || user.email || 'Developer'}</span>
                </div>
                <button className="btn-secondary mobile-auth-btn" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn-primary mobile-auth-btn" onClick={() => { setMobileMenuOpen(false); handleLogin(); }}>
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        if (user) {
          return (
            <>
              <PageHeader />
              <Dashboard user={user} />
            </>
          );
        }
        return (
          <>
            <PageHeader />
            <Landing onLogin={handleLogin} onNavigate={navigate} user={user} />
          </>
        );
      case 'blog-post':
        return (
          <>
            <PageHeader />
            <BlogPost slug={currentSlug!} onNavigate={navigate} onLogin={handleLogin} user={user} />
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
            <Docs onNavigate={navigate} />
          </>
        );
      case 'contact':
        return (
          <>
            <PageHeader />
            <Contact onNavigate={navigate} />
          </>
        );
      case 'home':
      default:
        return (
          <>
            <PageHeader />
            <Landing onLogin={handleLogin} onNavigate={navigate} user={user} />
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

      {/* Sovereign Auth Modal (Google, GitHub, Email/Password) */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onSuccess={(intent) => {
          setAuthModalOpen(false);
          if (intent === 'pro' && user) {
            window.location.href = `https://buy.stripe.com/cNi00jfmxftvedpeAq9R60b?client_reference_id=${user.uid}`;
          } else if (intent === 'api-key' || intent === 'limit-upgrade') {
            setCurrentView('dashboard');
          }
        }}
        intent={loginIntent}
      />
    </div>
  );
}

export default App;
