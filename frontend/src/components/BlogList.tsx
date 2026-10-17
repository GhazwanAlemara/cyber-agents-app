import { useState, useEffect } from 'react';

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

interface BlogListProps {
  onNavigate: (view: 'home' | 'docs' | 'pricing' | 'blog' | 'blog-post', slug?: string) => void;
}

const ITEMS_PER_PAGE = 6;

export default function BlogList({ onNavigate }: BlogListProps) {
  const [articles, setArticles] = useState<ArticleIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`https://storage.googleapis.com/cyberagents-seo-assets/seo_articles/articles_index.json?cb=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles index');
        }
        const data = await response.json();
        // Support both direct JSON array or nested articles key
        const list = Array.isArray(data) ? data : (data.articles || []);
        setArticles(list);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE) || 1;
  const paginatedArticles = articles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Knowledge Hub</h1>
        <p className="subtitle">Insights, updates, and deep dives into AI Agent security.</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading articles...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : articles.length === 0 ? (
        <div className="empty-state">No articles found.</div>
      ) : (
        <>
          <div className="articles-grid">
            {paginatedArticles.map((article) => {
              const rawDate = article.published_at || article.publish_date || article.date;
              const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
              const excerpt = article.summary || article.description || '';

              return (
                <div 
                  key={article.slug || article.id} 
                  className="article-card"
                  onClick={() => {
                    window.history.pushState({}, '', `/blog/${article.slug}`);
                    onNavigate('blog-post', article.slug);
                  }}
                >
                  {article.thumbnail_url && (
                    <div className="article-thumbnail-wrapper" style={{ marginBottom: '1.25rem', overflow: 'hidden', borderRadius: 'var(--radius)' }}>
                      <img 
                        src={article.thumbnail_url} 
                        alt={article.title} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} 
                      />
                    </div>
                  )}
                  <div className="article-card-content">
                    <div className="article-meta">
                      <span className="category-badge">{article.category || 'Security'}</span>
                      {formattedDate && <span className="date">{formattedDate}</span>}
                    </div>
                    <h2>{article.title}</h2>
                    {excerpt && <p>{excerpt}</p>}
                    <div className="read-more">
                      Read Article
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <button 
                className="pagination-btn pagination-nav-btn prev-btn" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous Page"
              >
                <span className="pagination-arrow">&larr;</span>
                <span className="pagination-text">Prev</span>
              </button>
              {(() => {
                const getVisiblePages = (current: number, total: number, mobile: boolean) => {
                  const maxButtons = mobile ? 3 : 5;
                  if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);

                  if (mobile) {
                    if (current <= 2) return [1, 2, 3];
                    if (current >= total - 1) return [total - 2, total - 1, total];
                    return [current - 1, current, current + 1];
                  }

                  if (current <= 3) return [1, 2, 3, 4, 5];
                  if (current >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
                  return [current - 2, current - 1, current, current + 1, current + 2];
                };
                
                return getVisiblePages(currentPage, totalPages, isMobile).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-btn pagination-num-btn ${pageNum === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
              <button 
                className="pagination-btn pagination-nav-btn next-btn" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next Page"
              >
                <span className="pagination-text">Next</span>
                <span className="pagination-arrow">&rarr;</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
