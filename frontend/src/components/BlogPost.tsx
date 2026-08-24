import { useState, useEffect } from 'react';

interface BlogPostProps {
  slug: string;
  onNavigate: (view: 'home' | 'docs' | 'pricing' | 'blog' | 'blog-post', slug?: string) => void;
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

export default function BlogPost({ slug, onNavigate }: BlogPostProps) {
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

  return (
    <article className="blog-post-container">
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
      </div>
      
      <div 
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.html_content }}
      />

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
