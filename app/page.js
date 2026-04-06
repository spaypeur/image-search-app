'use client';
import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

export default function Page() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Load recent searches on mount
  useEffect(() => {
    fetch('/api/recent')
      .then(res => res.json())
      .then(data => setRecent(data))
      .catch(console.error);
  }, []);

  const handleSearch = async (e, forceQuery = null, newPage = 1) => {
    if (e) e.preventDefault();
    const targetQuery = forceQuery || query;
    if (!targetQuery) return;

    setLoading(true);
    setQuery(targetQuery);
    setPage(newPage);
    
    try {
      const res = await fetch(`/api/images/${encodeURIComponent(targetQuery)}?page=${newPage}`);
      const data = await res.json();
      setImages(data);
      
      // Lazily optimistically update the recent list to save a network fetch
      setRecent(prev => [{ term: targetQuery, when: new Date().toISOString() }, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-2px' }}>
          Lumina<span style={{ color: 'var(--accent)' }}>Search</span>.
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>High-availability image abstraction layer.</p>
      </div>

      <div className="dashboard">
        
        {/* Sidebar: Recent Searches */}
        <aside className="sidebar">
          <h2>Recent Activity</h2>
          <ul className="recent-list">
             {recent.slice(0, 8).map((req, idx) => (
                <li key={idx} className="recent-tag" onClick={() => handleSearch(null, req.term, 1)}>
                  <span style={{ fontWeight: '500' }}>{req.term}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </li>
             ))}
             {recent.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No recent activity.</p>}
          </ul>
        </aside>

        {/* Main Interface */}
        <div>
          <form className="search-box" onSubmit={(e) => handleSearch(e)}>
            <input 
              type="text" 
              placeholder="Search high-res images (e.g. Neon Tokyo)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn-primary" type="submit" disabled={loading}>
               {loading ? <Loader2 className="animate-spin" /> : 'Search'}
            </button>
          </form>

          {/* Pinterest/Masonry Grid */}
          {images.length > 0 && (
            <>
              <div className="masonry">
                {images.map((img, ix) => (
                  <a key={ix} href={img.context} target="_blank" rel="noreferrer" className="image-card">
                    <img src={img.url} alt={img.snippet} loading="lazy" />
                    <div className="overlay">
                      <p>{img.snippet}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
                 <button 
                  onClick={() => handleSearch(null, query, page + 1)}
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer' }}
                 >
                   Load Page {page + 1}
                 </button>
              </div>
            </>
          )}

          {!loading && images.length === 0 && query && (
             <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>No results found.</p>
          )}
        </div>

      </div>
    </div>
  );
}
