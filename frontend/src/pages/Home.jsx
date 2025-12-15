import React from 'react'

export default function Home({ onNavigate }) {
  const features = [
    {
      id: 'text',
      icon: '📝',
      title: 'Text Notes',
      description: 'Store and organize text notes with full-text search capabilities',
      longDesc: 'Quickly capture your thoughts and ideas. Write plain text notes with instant full-text search to find exactly what you need.'
    },
    {
      id: 'pdf',
      icon: '📄',
      title: 'PDF Files',
      description: 'Upload and search through PDF documents automatically',
      longDesc: 'Upload PDF files and we automatically extract and index the text content for seamless searching.'
    },
    {
      id: 'web',
      icon: '🌐',
      title: 'Web Content',
      description: 'Capture and store content from web URLs',
      longDesc: 'Paste a URL and we fetch the article content automatically. Perfect for bookmarking important web pages.'
    },
    {
      id: 'images',
      icon: '🖼️',
      title: 'Images',
      description: 'Store images with descriptions and metadata',
      longDesc: 'Upload images and add descriptions. Organize by date and find them quickly with metadata search.'
    },
    {
      id: 'audio',
      icon: '🎵',
      title: 'Audio Files',
      description: 'Keep track of audio files with organized metadata',
      longDesc: 'Store audio recordings, podcasts, and music files with full metadata organization.'
    },
    {
      id: 'markdown',
      icon: '✍️',
      title: 'Markdown',
      description: 'Write rich content using Markdown formatting',
      longDesc: 'Create beautifully formatted documents with Markdown syntax for enhanced readability and structure.'
    }
  ]

  const handleFeatureClick = (featureId) => {
    // Navigate to dashboard when feature card is clicked
    onNavigate('dashboard')
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Second Brain System</h1>
          <p className="tagline">Your Personal Knowledge Vault</p>
          <p className="subtitle">Store, organize, and instantly retrieve everything that matters</p>
        </div>
      </header>

      <main className="home-content">
        <section className="hero">
          <div className="hero-inner">
            <h2>Capture Your Knowledge</h2>
            <p>
              Second Brain System is the ultimate personal knowledge management platform. 
              Designed for simplicity and power, it helps you store, organize, and retrieve 
              all forms of content in one beautifully intuitive space.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <h4>6 Content Types</h4>
                <p>Support for everything you create</p>
              </div>
              <div className="stat-item">
                <h4>Instant Search</h4>
                <p>Find anything in milliseconds</p>
              </div>
              <div className="stat-item">
                <h4>Always Available</h4>
                <p>Access your brain anytime</p>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="section-header">
            <h2>What You Can Store</h2>
            <p>From notes to PDFs, we support it all</p>
          </div>
          <div className="features-grid">
            {features.map(feature => (
              <div 
                key={feature.id} 
                className="feature-card"
                onClick={() => handleFeatureClick(feature.id)}
                role="button"
                tabIndex="0"
                onKeyPress={(e) => e.key === 'Enter' && handleFeatureClick(feature.id)}
              >
                <div className="feature-card-inner">
                  <div className="feature-icon-wrap">
                    <div className="feature-icon">{feature.icon}</div>
                  </div>
                  <h3>{feature.title}</h3>
                  <p className="feature-short">{feature.description}</p>
                  <p className="feature-long">{feature.longDesc}</p>
                  <div className="card-cta">Explore →</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="how-it-works">
          <div className="section-header">
            <h2>Three Simple Steps</h2>
            <p>Getting started is quick and easy</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Add Your Content</h3>
              <p>Upload text, PDFs, images, audio, web links, or markdown files. Choose your format, we handle the rest.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Organize & Filter</h3>
              <p>Sort by type, date, or use powerful search. Find exactly what you're looking for instantly.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Build Your Brain</h3>
              <p>Over time, your personal knowledge vault grows. A searchable repository of everything important to you.</p>
            </div>
          </div>
        </section>

        <section className="why-section">
          <div className="section-header">
            <h2>Why Second Brain?</h2>
            <p>Built for knowledge workers who value simplicity</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <h4>🚀 Fast & Responsive</h4>
              <p>Lightning-quick search and instant access to all your content</p>
            </div>
            <div className="why-card">
              <h4>🔒 Private & Secure</h4>
              <p>Your knowledge is yours alone, stored securely in your space</p>
            </div>
            <div className="why-card">
              <h4>🎯 Simple Interface</h4>
              <p>No complex features or learning curve. Just intuitive design</p>
            </div>
            <div className="why-card">
              <h4>📱 Always Available</h4>
              <p>Access your brain anytime, from anywhere. Your knowledge on demand</p>
            </div>
          </div>
        </section>

        <section className="cta-premium">
          <div className="cta-content">
            <h2>Start Building Your Brain Today</h2>
            <p>Join thousands building their personal knowledge vault</p>
            <button className="btn-cta-primary" onClick={() => onNavigate('dashboard')}>
              Launch Dashboard
            </button>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <p>Second Brain System © 2025</p>
          <p>Engineered for knowledge. Designed for simplicity.</p>
        </div>
      </footer>
    </div>
  )
}
