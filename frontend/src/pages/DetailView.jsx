import React, { useState } from 'react'

export default function DetailView({ item, onClose, onDelete, onCopy }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(item.content_text || '');
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  }

  const typeLabels = { text: 'Text', pdf: 'PDF', web: 'Web', image: 'Image', audio: 'Audio', markdown: 'Markdown' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="detail-meta">
            <span className="detail-type">{typeLabels[item.type] || item.type}</span>
            <span className="detail-date">{new Date(item.createdAt).toLocaleString()}</span>
            {item.source && <span className="detail-source">From: {item.source}</span>}
          </div>

          {item.type === 'image' && item.source && (
            <div className="image-preview">
              <img src={`/uploads/${item.source}`} alt={item.title} />
            </div>
          )}

          {item.type === 'audio' && item.source && (
            <div className="audio-player">
              <audio controls style={{ width: '100%' }}>
                <source src={`/uploads/${item.source}`} />
              </audio>
            </div>
          )}

          {item.content_text && (
            <div className="detail-content">
              <div className="content-text">{item.content_text}</div>
            </div>
          )}

          {!item.content_text && (
            <div className="no-content">No text content available</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button className="btn-danger" onClick={() => {
            if (confirm('Delete this item?')) {
              onDelete(item._id);
              onClose();
            }
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
