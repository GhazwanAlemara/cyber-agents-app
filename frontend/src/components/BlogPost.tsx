import { useState, useEffect } from 'react';
import { getAuthorForSlug } from '../data/authors';
import type { User } from 'firebase/auth';
import AgentSecurityWidget from './AgentSecurityWidget';

interface BlogPostProps {
  slug: string;
  onNavigate: (view: 'home' | 'docs' | 'pricing' | 'blog' | 'blog-post' | 'contact', slug?: string) => void;
  onLogin: (intent?: string) => void;
  user: User | null;
}

interface ArticleData {
  title: string;
  meta_description?: string;
  description?: string;
  published_at?: string;
  publish_date?: string;
  date?: string;
  category?: string;
  html_content: string;
  author?: string;
}

interface ArticleIndexEntry {
  id?: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  published_at?: string;
  publish_date?: string;
  date?: string;
  category?: string;
  thumbnail_url?: string;
}

export default function BlogPost({ slug, onNavigate, onLogin, user }: BlogPostProps) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        const timestamp = new Date().getTime();
        // Fetch specific article
        const response = await fetch(`https://storage.googleapis.com/cyberagents-seo-assets/seo_articles/${slug}.json?cb=${timestamp}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);

        // Fetch index for related articles
        try {
          const indexRes = await fetch(`https://storage.googleapis.com/cyberagents-seo-assets/seo_articles/articles_index.json?cb=${timestamp}`);
          if (indexRes.ok) {
            const indexData = await indexRes.json();
            const list: ArticleIndexEntry[] = Array.isArray(indexData) ? indexData : (indexData.articles || []);
            const filtered = list.filter(item => item.slug !== slug).slice(0, 4);
            setRelatedArticles(filtered);
          }
        } catch {
          // Non-critical, ignore related articles error
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticleAndRelated();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="loading-spinner">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="blog-post-container">
        <div className="error-message">Error loading article: {error || 'Not found'}</div>
        <button className="btn-secondary mt-4" style={{ marginTop: '1rem' }} onClick={() => {
            window.history.pushState({}, '', '/blog');
            onNavigate('blog');
        }}>Back to Knowledge Hub</button>
      </div>
    );
  }

  const rawDate = article.published_at || article.publish_date || article.date;
  const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const description = article.meta_description || article.description || '';
  const author = getAuthorForSlug(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": article.title,
    "datePublished": rawDate || new Date().toISOString(),
    "dateModified": rawDate || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.role,
      "description": author.bio,
      "knowsAbout": author.credentials
    },
    "publisher": {
      "@type": "Organization",
      "name": "CyberAgents",
      "url": "https://cyberagents.app"
    },
    "description": description
  };

  return (
    <article className="blog-post-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="blog-post-header">
        <button className="back-btn" onClick={() => {
          window.history.pushState({}, '', '/blog');
          onNavigate('blog');
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Knowledge Hub
        </button>
        <div className="article-meta-header">
          <span className="category-badge">{article.category || 'Security'}</span>
          {formattedDate && <span className="date">{formattedDate}</span>}
        </div>
        <h1>{article.title}</h1>
        {description && <p className="article-description">{description}</p>}

        {/* Author Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0 1rem 0', padding: '0.75rem 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src={author.avatar} alt={author.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(56,189,248,0.3)' }} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main, #f8fafc)', fontSize: '0.95rem' }}>{author.name}</div>
            <div style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.8rem' }}>{author.role}</div>
          </div>
        </div>
      </div>
      
      {(() => {
        const paragraphs = (article.html_content || '').split('</p>');
        const midPoint = Math.max(1, Math.floor(paragraphs.length * 0.3));
        const firstPart = paragraphs.slice(0, midPoint).join('</p>') + (midPoint > 0 && paragraphs.length > 1 ? '</p>' : '');
        const secondPart = paragraphs.slice(midPoint).join('</p>');

        return (
          <>
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: firstPart }}
            />

            <AgentSecurityWidget 
              articleTitle={article.title}
              articleSlug={slug}
              onLogin={onLogin}
              onNavigate={onNavigate}
              user={user}
            />

            {secondPart && (
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: secondPart }}
              />
            )}

            {/* In-Article High-Intent Conversion Banner */}
            <div className="article-conversion-banner">
              <div className="conversion-banner-content">
                <span className="banner-badge">ENTERPRISE AGENT GUARDRAILS • THE SUPERNOVA SHIELD</span>
                <h3>Automate Prompt Injection & MCP Security Across Your Fleet</h3>
                <p>
                  Deploy real-time guardrails for LangChain, CrewAI, AutoGen, and custom Python/Node agents with 2 lines of code. The native security shield for the Supernova agent ecosystem.
                </p>
                <div className="banner-actions">
                  <button className="btn-primary" onClick={() => onLogin('blog-banner')}>
                    Start Free (1,000 API requests/mo)
                  </button>
                  <button className="btn-secondary" onClick={() => onNavigate('docs')}>
                    Read Developer Docs →
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Author Bio Box */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', margin: '3rem 0 2rem 0', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <img src={author.avatar} alt={author.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8', flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#38bdf8' }}>Security Research Author</span>
          <h4 style={{ margin: '0.25rem 0', fontSize: '1.15rem', color: '#f8fafc' }}>{author.name}</h4>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>{author.role} • {author.credentials}</div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>{author.bio}</p>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <div className="related-articles-section">
          <h3>Related Security Insights</h3>
          <div className="related-articles-grid">
            {relatedArticles.map((rel) => (
              <div 
                key={rel.slug || rel.id} 
                className="article-card related-card"
                onClick={() => {
                  window.history.pushState({}, '', `/blog/${rel.slug}`);
                  onNavigate('blog-post', rel.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {rel.thumbnail_url && (
                  <div className="article-thumbnail-wrapper" style={{ marginBottom: '1rem', overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                    <img 
                      src={rel.thumbnail_url} 
                      alt={rel.title} 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} 
                    />
                  </div>
                )}
                <div className="article-card-content">
                  <div className="article-meta">
                    <span className="category-badge">{rel.category || 'Security'}</span>
                  </div>
                  <h4>{rel.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
