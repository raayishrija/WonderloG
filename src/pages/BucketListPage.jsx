import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBucket } from '../context/BucketContext'
import './BucketListPage.css'

const fmt = (n) => {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K'
  return n?.toLocaleString() || '0'
}

export default function BucketListPage() {
  const { wishlist, visited, removeFromWishlist, removeFromVisited,
          addToVisited, totalWishlistPop, totalVisitedPop } = useBucket()
  const navigate = useNavigate()
  const [tab, setTab] = useState('wishlist')

  const list = tab === 'wishlist' ? wishlist : visited
  const isEmpty = list.length === 0

  const handleMarkVisited = (country) => {
    addToVisited(country)
  }

  return (
    <div className="bucket-page">
      <div className="bucket-header">
        <div>
          <h1 className="bucket-title">My Travel List</h1>
          <p className="text-muted text-sm">Track your wanderlust, one country at a time.</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bucket-stats">
        <div className="stat-card">
          <div className="stat-num">{wishlist.length}</div>
          <div className="stat-label text-xs text-muted">On Wishlist</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-card">
          <div className="stat-num">{visited.length}</div>
          <div className="stat-label text-xs text-muted">Visited</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-card">
          <div className="stat-num">{fmt(totalVisitedPop)}</div>
          <div className="stat-label text-xs text-muted">Population Explored</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-card">
          <div className="stat-num">{fmt(totalWishlistPop)}</div>
          <div className="stat-label text-xs text-muted">Pop. on Wishlist</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bucket-tabs">
        <button
          className={`bucket-tab ${tab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setTab('wishlist')}
        >
          ♡ Wishlist ({wishlist.length})
        </button>
        <button
          className={`bucket-tab ${tab === 'visited' ? 'active' : ''}`}
          onClick={() => setTab('visited')}
        >
          ✓ Visited ({visited.length})
        </button>
      </div>

      <div className="bucket-content">
        {isEmpty ? (
          <div className="bucket-empty">
            <div className="empty-emoji">{tab === 'wishlist' ? '🗺️' : '✈️'}</div>
            <h2>
              {tab === 'wishlist'
                ? 'Your wishlist is empty'
                : 'No visited countries yet'}
            </h2>
            <p className="text-muted">
              {tab === 'wishlist'
                ? 'Go explore the world and add countries you\'d love to visit.'
                : 'Mark countries as visited when you\'ve been there.'}
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/explore')}>
              Explore Countries
            </button>
          </div>
        ) : (
          <div className="bucket-list">
            {list.map((country, i) => (
              <BucketItem
                key={country.cca3}
                country={country}
                tab={tab}
                style={{ animationDelay: `${i * 0.06}s` }}
                onRemove={() =>
                  tab === 'wishlist'
                    ? removeFromWishlist(country.cca3)
                    : removeFromVisited(country.cca3)
                }
                onMarkVisited={() => handleMarkVisited(country)}
                onClick={() => navigate(`/country/${country.cca3}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BucketItem({ country, tab, style, onRemove, onMarkVisited, onClick }) {
  const pop = (n) => n?.toLocaleString() || '—'

  return (
    <div className="bucket-item animate-fade-up" style={style}>
      <div className="bi-flag" onClick={onClick}>
        <img
          src={country.flags?.svg || country.flags?.png}
          alt={country.name.common}
        />
      </div>
      <div className="bi-info" onClick={onClick}>
        <div className="bi-name">{country.name.common}</div>
        <div className="bi-meta text-sm text-muted">
          {country.region}
          {country.capital?.[0] && ` · ${country.capital[0]}`}
          {' · '}{pop(country.population)} people
        </div>
      </div>
      <div className="bi-actions">
        {tab === 'wishlist' && (
          <button
            className="bi-btn bi-btn--visit"
            onClick={onMarkVisited}
            title="Mark as visited"
          >
            ✓ Visited
          </button>
        )}
        <button
          className="bi-btn bi-btn--remove"
          onClick={onRemove}
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
