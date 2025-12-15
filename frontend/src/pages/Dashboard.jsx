import React, { useState, useEffect } from 'react'
import API, { authHeader } from '../api'
import DetailView from './DetailView'

function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = { success: '#4caf50', error: '#f44336', info: '#2196f3' };
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, padding: '14px 20px',
      background: colors[type], color: 'white', borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 999,
      animation: 'slideIn 0.3s ease'
    }}>
      {message}
    </div>
  );
}

function UploadForm({ token, onUploaded }){
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState('text')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  async function submit(e){
    e.preventDefault();
    if (!file && !text && !url) {
      setToast({ message: 'Add text, file, or URL', type: 'error' });
      return;
    }
    setLoading(true);
    const fd = new FormData();
    if (file) fd.append('file', file);
    fd.append('text', text);
    fd.append('url', url);
    fd.append('type', type);
    if (title) fd.append('title', title);
    try{
      const r = await API.post('/content/upload', fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      onUploaded(r.data.item)
      setFile(null); setText(''); setUrl(''); setTitle('');
      setToast({ message: 'Content uploaded successfully', type: 'success' });
    }catch(e){ 
      setToast({ message: e.response?.data?.error || 'Upload failed', type: 'error' });
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
      <form className="upload" onSubmit={submit}>
        <h3>Add Content</h3>
        <input 
          type="text" 
          placeholder="Title (optional)" 
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          disabled={loading} 
        />
        <select value={type} onChange={e=>setType(e.target.value)} disabled={loading}>
          <option value="text">Text</option>
          <option value="pdf">PDF</option>
          <option value="markdown">Markdown</option>
          <option value="web">Web URL</option>
          <option value="image">Image</option>
          <option value="audio">Audio</option>
        </select>
        <input type="file" onChange={e=>setFile(e.target.files[0])} disabled={loading} />
        <textarea placeholder="Or paste text..." value={text} onChange={e=>setText(e.target.value)} disabled={loading} />
        <input placeholder="Or enter URL..." value={url} onChange={e=>setUrl(e.target.value)} disabled={loading} />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

function SearchBar({ token, onSearch }){
  const [q, setQ] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      const r = await API.get(`/content/search?${params}`, authHeader(token));
      onSearch(r.data.items);
    } catch(e) {
      console.error('Search failed', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Search content..." 
        value={q} 
        onChange={e=>setQ(e.target.value)} 
      />
      <input 
        type="date" 
        value={fromDate} 
        onChange={e=>setFromDate(e.target.value)}
        title="From date"
      />
      <input 
        type="date" 
        value={toDate} 
        onChange={e=>setToDate(e.target.value)}
        title="To date"
      />
      <button type="submit" disabled={loading}>
        {loading ? '...' : 'Search'}
      </button>
      <button type="button" onClick={() => { setQ(''); setFromDate(''); setToDate(''); onSearch(null); }} className="clear-btn">
        Clear
      </button>
    </form>
  );
}

function ContentList({ token, refresh }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(()=>{ fetchList() },[refresh])

  async function fetchList(){
    setLoading(true);
    try {
      const r = await API.get('/content/list', authHeader(token));
      setItems(r.data.items);
    } catch(e) {
      setToast({ message: 'Failed to load content', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id) {
    try {
      await API.delete(`/content/${id}`, authHeader(token));
      setItems(items.filter(i => i._id !== id));
      setToast({ message: 'Deleted successfully', type: 'success' });
    } catch(e) {
      setToast({ message: 'Delete failed', type: 'error' });
    }
  }

  function handleSearch(results) {
    if (results === null) fetchList();
    else setItems(results);
  }

  function getFilteredAndSorted() {
    let filtered = [...items];
    
    if (filterType) {
      filtered = filtered.filter(i => i.type === filterType);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'type') {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    }

    return filtered;
  }

  const typeLabels = { text: 'Text', pdf: 'PDF', web: 'Web', image: 'Image', audio: 'Audio', markdown: 'Markdown' };
  const filteredItems = getFilteredAndSorted();

  return (
    <>
      <div className="list">
        <SearchBar token={token} onSearch={handleSearch} />
        
        <div className="filters-bar">
          <div className="filter-group">
            <label>Filter by type:</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
              <option value="markdown">Markdown</option>
              <option value="web">Web</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date">Latest First</option>
              <option value="title">Title A-Z</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
        
        {loading && <div className="loader">Loading...</div>}
        
        {!loading && filteredItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>{filterType ? 'No items with this type' : 'No content yet. Upload something!'}</p>
          </div>
        )}

        {!loading && filteredItems.length > 0 && (
          <>
            <div className="count">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}</div>
            {filteredItems.map(i=> (
              <div key={i._id} className="item" onClick={() => setSelectedItem(i)}>
                <div className="item-header">
                  <strong>{i.title}</strong>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteItem(i._id); }} title="Delete">Delete</button>
                </div>
                <div className="item-content">
                  {i.content_text && <p className="preview">{i.content_text.slice(0, 120)}...</p>}
                </div>
                <div className="meta">
                  <span className="type-badge">{typeLabels[i.type] || i.type}</span>
                  <span>{new Date(i.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedItem && (
        <DetailView 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)}
          onDelete={deleteItem}
          onCopy={() => setToast({ message: 'Copied to clipboard', type: 'success' })}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  )
}

export default function Dashboard({ onNavigateTo, onLogout }){
  const [refresh, setRefresh] = useState(0)
  const token = localStorage.getItem('token')
  
  return (
    <div className="dashboard">
      <header>
        <h2>Second Brain System</h2>
        <div className="header-buttons">
          <button className="btn-home" onClick={() => onNavigateTo('home')}>Home</button>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </header>
      <main>
        <UploadForm token={token} onUploaded={()=>setRefresh(r=>r+1)} />
        <ContentList token={token} refresh={refresh} />
      </main>
    </div>
  )
}
