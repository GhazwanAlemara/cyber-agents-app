interface LandingProps {
  onLogin: () => void;
  onNavigate: (view: 'home' | 'docs' | 'pricing') => void;
}

function Landing({ onLogin, onNavigate }: LandingProps) {
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>The Autonomous Security OS for <span className="highlight">AI Agents</span></h1>
          <p className="subtitle">
            Deploy a swarm of lightweight AI security agents that detect, explain, and autonomously fix vulnerabilities in your code and AI pipelines—before they reach production.
          </p>
          <div className="cta-group">
            <button className="btn-primary large" onClick={onLogin}>
              Start for Free
            </button>
            <button className="btn-secondary large" onClick={() => onNavigate('docs')}>
              Read the Docs
            </button>
          </div>
          <div className="trusted-by">
            <p>Trusted by forward-thinking engineering teams</p>
            <div className="badges">
              <img src="https://img.shields.io/badge/Open_Source-100%25-success?style=for-the-badge" alt="Open Source" />
              <img src="https://img.shields.io/badge/AI_Agent_Ready-Gemini_&_GPT4-3b82f6?style=for-the-badge" alt="AI Ready" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <h2>Enterprise Security, <br/>Zero Friction</h2>
          <p>Everything you need to secure modern AI workflows.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Auto-Remediation</h3>
            <p>Detects supply chain vulnerabilities and automatically opens a perfectly formatted PR to fix them in seconds, not hours.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Prompt Injection Defense</h3>
            <p>Middleware SDK to monitor AI agents in real-time, blocking malicious instructions, prompt hijackings, and data exfiltration.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3>Collaborative Intel</h3>
            <p>When one agent is attacked, the cryptographic signature is shared globally. An attack on one makes the whole network immune.</p>
          </div>
        </div>
      </section>

      {/* Open Source / Community Section */}
      <section className="oss-section" id="oss">
        <div className="oss-content">
          <h2>Open Source at its Core</h2>
          <p>Security requires transparency. Our core engine and AI middleware are fully open-source. Join the community and verify the code yourself.</p>
          <a href="https://github.com/GhazwanAlemara/cyber-agents-app" target="_blank" rel="noreferrer" className="btn-secondary github-btn">
            View on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/logo.png" alt="CyberAgents" className="footer-logo" />
            <p>© 2026 CyberAgents. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('pricing')}>Pricing</a>
              <a href="https://github.com/GhazwanAlemara/cyber-agents-app/commits/main" target="_blank" rel="noreferrer">Changelog</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('docs')}>Documentation</a>
              <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('docs')}>API Reference</a>
              <a href="#oss">Community</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
