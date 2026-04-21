import { useState } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          🛡️ Cyber<span>Agents</span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#oss">Open Source</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div>
          {isAuthenticated ? (
            <button className="btn-secondary" onClick={() => setIsAuthenticated(false)}>Logout</button>
          ) : (
            <button className="btn-primary" onClick={() => setIsAuthenticated(true)}>Login with GitHub</button>
          )}
        </div>
      </nav>

      {isAuthenticated ? <Dashboard /> : <Landing onLogin={() => setIsAuthenticated(true)} />}
    </div>
  );
}

export default App;
