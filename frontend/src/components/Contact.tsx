import { useState } from 'react';

interface ContactProps {
  onNavigate: (view: any, slug?: string) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSending(true);
    const targetEmail = 'support@cyberagents.app';
    const subject = `[CyberAgents Inquiry] ${formData.subject || 'Security'} - ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        _subject: subject,
        _captcha: 'false'
      })
    })
    .catch(() => {})
    .finally(() => {
      setSending(false);
      setSubmitted(true);
      try {
        window.location.href = mailtoUrl;
      } catch {}
    });
  };

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "CyberAgents Security & Incident Response Desk",
    "url": "https://cyberagents.app/contact",
    "description": "Direct communication channel for enterprise AI security advisory, vulnerability disclosure, and MCP protocol integration support."
  };

  return (
    <div className="blog-post-container" style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Direct Security Channel
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', margin: '0.5rem 0 1rem 0' }}>
          Contact CyberAgents
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Connect with our autonomous agent security researchers, incident response specialists, and MCP protocol engineers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '0.75rem', color: '#38bdf8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>Security Desk</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Direct enterprise inquiries & technical support.</p>
          <a href="mailto:support@cyberagents.app" style={{ color: '#38bdf8', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>
            support@cyberagents.app
          </a>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '0.75rem', color: '#38bdf8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>Vulnerability Disclosure</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Responsible disclosure of LLM backdoors or zero-days.</p>
          <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>PGP Encrypted • SLA &lt; 12h</span>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ marginBottom: '0.75rem', color: '#38bdf8' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>Operations Center</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.75rem' }}>Global Security Operations & Cloud Defense.</p>
          <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500 }}>United States & European Union</span>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem 2.5rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '1rem', color: '#10b981' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>Inquiry Dispatched</h3>
            <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
              Thank you for reaching out. Your security inquiry has been routed to <strong>support@cyberagents.app</strong>. If your email app did not open automatically, click below to verify or send from your mail client.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`mailto:support@cyberagents.app?subject=${encodeURIComponent(`[CyberAgents Inquiry] ${formData.subject || 'Security'} - ${formData.name}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`)}`}
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
              >
                Open in Email App
              </a>
              <button className="btn-secondary" onClick={() => setSubmitted(false)}>Send Another Message</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Alex Mercer"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@enterprise.com"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Enterprise MCP Security Assessment / Vulnerability Inquiry"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.5rem' }}>Message</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your security requirements or target AI agent architecture..."
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem', resize: 'vertical' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={sending}
              className="btn-primary" 
              style={{ padding: '0.85rem', fontWeight: 700, marginTop: '0.5rem', opacity: sending ? 0.7 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
            >
              {sending ? 'Transmitting...' : 'Submit Security Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
