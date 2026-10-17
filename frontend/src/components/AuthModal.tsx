import { useState } from 'react';
import { auth, googleProvider, githubProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  type AuthError
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (intent?: string) => void;
  intent?: string | null;
}

export default function AuthModal({ isOpen, onClose, onSuccess, intent }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);
    try {
      if (intent) {
        localStorage.setItem('login_intent', intent);
      }
      const targetProvider = provider === 'google' ? googleProvider : githubProvider;
      await signInWithPopup(auth, targetProvider);
      onSuccess(intent || undefined);
      onClose();
    } catch (err: any) {
      console.error(`${provider} login failed:`, err);
      const authErr = err as AuthError;
      if (authErr.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else if (authErr.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email using a different sign-in provider.');
      } else if (authErr.code === 'auth/operation-not-allowed' || authErr.code === 'auth/configuration-not-found') {
        setError(`${provider === 'google' ? 'Google' : 'GitHub'} sign-in provider is pending configuration. Please continue with GitHub or Email & Password below.`);
      } else {
        setError(authErr.message || `Failed to sign in with ${provider}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (intent) {
        localStorage.setItem('login_intent', intent);
      }
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess(intent || undefined);
      onClose();
    } catch (err: any) {
      console.error('Email auth failed:', err);
      const authErr = err as AuthError;
      if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (authErr.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (authErr.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else {
        setError(authErr.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        {error && <div className="auth-modal-error">{error}</div>}

        <div className="auth-modal-grid">
          {/* Left Column: Brand Context & Social Sign-In */}
          <div className="auth-modal-col auth-modal-brand">
            <div className="auth-modal-header">
              <div className="auth-modal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>{mode === 'signin' ? 'Welcome to CyberAgents' : 'Create Free Workspace'}</h3>
              <p>
                {intent === 'download-audit'
                  ? 'Sign in to download and save your certified Agent Security Audit Report.'
                  : intent === 'pro'
                  ? 'Sign in to activate your 14-day CyberAgents Pro trial.'
                  : 'Secure autonomous LLM pipelines, prompt injections, and MCP tools in real-time.'}
              </p>
            </div>

            <div className="auth-social-buttons">
              <button 
                type="button" 
                className="auth-btn-social google" 
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button 
                type="button" 
                className="auth-btn-social github" 
                onClick={() => handleSocialLogin('github')}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="auth-modal-divider">
            <span>or continue with email</span>
          </div>

          {/* Right Column: Direct Workspace Email / Password */}
          <div className="auth-modal-col auth-modal-form-col">
            <form onSubmit={handleEmailAuth} className="auth-email-form">
              <div className="auth-form-group">
                <label htmlFor="auth-email">Work or Personal Email</label>
                <input 
                  id="auth-email"
                  type="email" 
                  placeholder="engineer@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="auth-password">Password</label>
                <input 
                  id="auth-password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}
              </button>
            </form>

            <div className="auth-modal-footer">
              {mode === 'signin' ? (
                <p>
                  New to CyberAgents?{' '}
                  <button type="button" className="auth-toggle-link" onClick={() => { setMode('signup'); setError(null); }}>
                    Create free account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button type="button" className="auth-toggle-link" onClick={() => { setMode('signin'); setError(null); }}>
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
