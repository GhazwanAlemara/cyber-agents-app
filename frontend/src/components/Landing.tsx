function Landing({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="hero">
      <h1>The Autonomous Security OS for AI Agents</h1>
      <p>
        Deploy a swarm of lightweight AI security agents that detect, explain, and autonomously fix vulnerabilities in your code and AI pipelines—before they reach production.
      </p>
      <div className="cta-group">
        <button className="btn-primary" onClick={onLogin}>Install GitHub App (Free)</button>
        <button className="btn-secondary">Read the Docs</button>
      </div>

      <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', textAlign: 'left' }}>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3>🛡️ Auto-Remediation</h3>
          <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: 0 }}>Detects supply chain vulnerabilities and automatically opens a perfectly formatted PR to fix them.</p>
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3>🧠 Prompt Injection Defense</h3>
          <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: 0 }}>Middleware SDK to monitor AI agents in real-time, blocking malicious instructions and prompt hijackings.</p>
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h3>🌐 Collaborative Intel</h3>
          <p style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: 0 }}>When one agent is attacked, the cryptographic signature is shared to protect the entire global network.</p>
        </div>
      </div>
    </main>
  );
}

export default Landing;
