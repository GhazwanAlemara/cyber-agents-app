export default function Pricing({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Transparent, Developer-First Pricing</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        Start securing your agents for free. Upgrade only when your team needs advanced enterprise controls and higher scale.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Free Tier */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Community</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Perfect for solo developers and open-source projects.</p>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/month</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', flex: 1 }}>
            <li style={{ marginBottom: '1rem' }}>✅ Up to 3 Repositories</li>
            <li style={{ marginBottom: '1rem' }}>✅ 10,000 Agent Actions / month</li>
            <li style={{ marginBottom: '1rem' }}>✅ Basic Auto-Remediation PRs</li>
            <li style={{ marginBottom: '1rem' }}>✅ Community Support</li>
            <li style={{ marginBottom: '1rem' }}>✅ Public README Badge</li>
          </ul>
          <button className="btn-secondary" style={{ width: '100%', padding: '1rem' }} onClick={onLogin}>Get Started Free</button>
        </div>

        {/* Pro Tier */}
        <div style={{ backgroundColor: 'var(--bg-dark)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '2px solid var(--accent-primary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--accent-primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 'bold' }}>MOST POPULAR</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pro</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>For startups and teams deploying production AI agents.</p>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>$49<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/month</span></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', flex: 1 }}>
            <li style={{ marginBottom: '1rem' }}>✅ Unlimited Repositories</li>
            <li style={{ marginBottom: '1rem' }}>✅ 250,000 Agent Actions / month</li>
            <li style={{ marginBottom: '1rem' }}>✅ Advanced AI Remediation</li>
            <li style={{ marginBottom: '1rem' }}>✅ Slack / Teams Alerts</li>
            <li style={{ marginBottom: '1rem' }}>✅ Private Threat Intel Dashboard</li>
          </ul>
          <button className="btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={onLogin}>Start 14-Day Trial</button>
        </div>

        {/* Enterprise Tier */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>For organizations needing compliance and custom deployment.</p>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Custom</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', flex: 1 }}>
            <li style={{ marginBottom: '1rem' }}>✅ Unlimited Agent Actions</li>
            <li style={{ marginBottom: '1rem' }}>✅ SOC2 / HIPAA Compliance Exports</li>
            <li style={{ marginBottom: '1rem' }}>✅ Custom AI Model Tuning</li>
            <li style={{ marginBottom: '1rem' }}>✅ SSO (SAML/Okta)</li>
            <li style={{ marginBottom: '1rem' }}>✅ Dedicated Success Manager</li>
          </ul>
          <button className="btn-secondary" style={{ width: '100%', padding: '1rem' }}>Contact Sales</button>
        </div>
      </div>
    </div>
  );
}
