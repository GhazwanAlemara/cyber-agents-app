import type { User } from 'firebase/auth';
import AgentSecurityWidget from './AgentSecurityWidget';

interface LandingProps {
  onLogin: (intent?: string) => void;
  onNavigate: (view: 'home' | 'docs' | 'pricing' | 'blog' | 'contact') => void;
  user: User | null;
}

function Landing({ onLogin, onNavigate, user }: LandingProps) {
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="supernova-badge-wrapper" style={{ marginBottom: '1.25rem' }}>
            <a 
              href="https://supernova.cool" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="supernova-ecosystem-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.45rem 1.15rem',
                borderRadius: '9999px',
                background: 'rgba(255, 72, 176, 0.08)',
                border: '1px solid rgba(255, 72, 176, 0.3)',
                color: '#ff48b0',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(255, 72, 176, 0.15)'
              }}
            >
              <span>The Supernova Shield</span>
              <span style={{ opacity: 0.4 }}>|</span>
              <span style={{ color: '#cbd5e1', fontWeight: 500 }}>AEGIS Agent Security OS ↗</span>
            </a>
          </div>
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

      {/* Live Interactive Threat Scanner Section */}
      <section className="live-lab-section" id="live-scanner" style={{ maxWidth: '1000px', margin: '1rem auto 3rem auto', padding: '0 1.5rem' }}>
        <AgentSecurityWidget 
          articleTitle="CyberAgents Core Platform"
          articleSlug="homepage"
          onLogin={onLogin}
          onNavigate={onNavigate as any}
          user={user}
        />
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
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <h3>Auto-Remediation</h3>
              <p>Detects supply chain vulnerabilities and automatically opens a perfectly formatted PR to fix them in seconds, not hours.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Prompt Injection Defense</h3>
              <p>Middleware SDK to monitor AI agents in real-time, blocking malicious instructions, prompt hijackings, and data exfiltration.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <h3>Collaborative Intel</h3>
              <p>When one agent is attacked, the cryptographic signature is shared globally. An attack on one makes the whole network immune.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>A2A Trust Scoring</h3>
              <p>Validate identity and trust when agents call other agents. Our proprietary scoring ensures your agentic swarm never leaks context.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3>Autonomous Sandboxing</h3>
              <p>Isolate agent execution in high-security, ephemeral GVisor containers. Execute untrusted code with absolute peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
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
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Up to 3 Repositories
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                10,000 Agent Actions / month
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Basic Auto-Remediation PRs
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Community Support
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Public README Badge
              </li>
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
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited Repositories
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                250,000 Agent Actions / month
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Advanced AI Remediation
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Slack / Teams Alerts
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Private Threat Intel Dashboard
              </li>
            </ul>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => onLogin('pro')}>Start 14-Day Trial</button>
          </div>

          {/* Enterprise Tier */}
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>For organizations needing compliance and custom deployment.</p>
            <div className="pricing-price">Custom</div>
            <ul className="pricing-features">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Unlimited Agent Actions
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                SOC2 / HIPAA Compliance Exports
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Custom AI Model Tuning
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                SSO (SAML/Okta)
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                Dedicated Success Manager
              </li>
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
              <a style={{ cursor: 'pointer' }} onClick={() => { window.history.pushState({}, '', '/contact'); onNavigate('contact' as any); }}>Contact & Support</a>
            </div>
            <div className="link-group">
              <h4>Ecosystem</h4>
              <a href="https://supernova.cool" target="_blank" rel="noopener noreferrer">Supernova MCP Gateway ↗</a>
              <a href="https://supernova.cool/trust" target="_blank" rel="noopener noreferrer">AEGIS Trust Layer ↗</a>
              <a href="https://supernova.cool/mcp" target="_blank" rel="noopener noreferrer">MCP Tool Registry ↗</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Landing;
