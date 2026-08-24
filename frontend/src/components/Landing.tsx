interface LandingProps {
  onLogin: (intent?: string) => void;
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
            <button className="btn-primary large" onClick={() => onLogin()}>
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
        <div className="section-wrapper">
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
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>A2A Trust Scoring</h3>
              <p>Validate identity and trust when agents call other agents. Our proprietary scoring ensures your agentic swarm never leaks context.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Autonomous Sandboxing</h3>
              <p>Isolate agent execution in high-security, ephemeral GVisor containers. Execute untrusted code with absolute peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Compliance-Ready Audit</h3>
              <p>Automated SOC2 and HIPAA evidence generation for every agent behavior, tool call, and data access point in your infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-header">
          <h2>Transparent, Developer-First Pricing</h2>
          <p>Start securing your agents for free. Upgrade only when your team needs advanced enterprise controls and higher scale.</p>
        </div>

        <div className="pricing-grid">
          {/* Free Tier */}
          <div className="pricing-card">
            <h3>Community</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Perfect for solo developers and open-source projects.</p>
            <div className="pricing-price">$0<span>/month</span></div>
            <ul className="pricing-features">
              <li>✅ Up to 3 Repositories</li>
              <li>✅ 10,000 Agent Actions / month</li>
              <li>✅ Basic Auto-Remediation PRs</li>
              <li>✅ Community Support</li>
              <li>✅ Public README Badge</li>
            </ul>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => onLogin()}>Get Started Free</button>
          </div>

          {/* Pro Tier */}
          <div className="pricing-card featured">
            <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'var(--accent-primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 1 }}>MOST POPULAR</div>
            <h3>Pro</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>For startups and teams deploying production AI agents.</p>
            <div className="pricing-price">$49<span>/month</span></div>
            <ul className="pricing-features">
              <li>✅ Unlimited Repositories</li>
              <li>✅ 250,000 Agent Actions / month</li>
              <li>✅ Advanced AI Remediation</li>
              <li>✅ Slack / Teams Alerts</li>
              <li>✅ Private Threat Intel Dashboard</li>
            </ul>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => onLogin('pro')}>Start 14-Day Trial</button>
          </div>

          {/* Enterprise Tier */}
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>For organizations needing compliance and custom deployment.</p>
            <div className="pricing-price">Custom</div>
            <ul className="pricing-features">
              <li>✅ Unlimited Agent Actions</li>
              <li>✅ SOC2 / HIPAA Compliance Exports</li>
              <li>✅ Custom AI Model Tuning</li>
              <li>✅ SSO (SAML/Okta)</li>
              <li>✅ Dedicated Success Manager</li>
            </ul>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => window.location.href = 'mailto:support@datagenius.io'}>Contact Sales</button>
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
            <img src="/logo-v3.png" alt="CyberAgents" className="footer-logo" />
            <p>© 2026 CyberAgents. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="https://github.com/GhazwanAlemara/cyber-agents-app/commits/main" target="_blank" rel="noreferrer">Changelog</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a style={{ cursor: 'pointer' }} onClick={() => { window.history.pushState({}, '', '/blog'); onNavigate('blog' as any); }}>Knowledge Hub</a>
              <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('docs')}>Documentation</a>
              <a style={{ cursor: 'pointer' }} onClick={() => onNavigate('docs')}>API Reference</a>
              <a href="https://github.com/GhazwanAlemara/cyber-agents-app" target="_blank" rel="noreferrer">Community</a>
              <a href="mailto:support@datagenius.io">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
