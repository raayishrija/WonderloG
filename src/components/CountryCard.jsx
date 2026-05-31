import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBucket } from '../context/BucketContext'
import './CountryCard.css'

export default function CountryCard({ country, style }) {
  const navigate = useNavigate()
  const { getStatus, addToWishlist, addToVisited, removeFromWishlist, removeFromVisited } = useBucket()
  const status = getStatus(country.cca3)

  const pop = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K'
    return n?.toLocaleString() || '—'
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    if (status === 'wishlist') removeFromWishlist(country.cca3)
    else addToWishlist(country)
  }

  const handleVisited = (e) => {
    e.stopPropagation()
    if (status === 'visited') removeFromVisited(country.cca3)
    else addToVisited(country)
  }

  return (
    <div
      className={`country-card ${status ? `country-card--${status}` : ''}`}
      style={style}
      onClick={() => navigate(`/country/${country.cca3}`)}
    >
      {status && (
        <div className={`card-stamp card-stamp--${status}`}>
          {status === 'visited' ? '✓ Visited' : '♡ Wishlist'}
        </div>
      )}

      <div className="card-flag">
        <img
          src={country.flags?.svg || country.flags?.png}
          alt={`${country.name.common} flag`}
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <div className="card-region text-xs text-muted">{country.region}</div>
        <h3 className="card-name">{country.name.common}</h3>
        <div className="card-meta">
          <span>👥 {pop(country.population)}</span>
          {country.capital?.[0] && <span>🏙 {country.capital[0]}</span>}
        </div>
      </div>

      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button
          className={`action-btn ${status === 'wishlist' ? 'action-btn--active-wish' : ''}`}
          onClick={handleWishlist}
          title="Add to wishlist"
        >
          {status === 'wishlist' ? '♥' : '♡'}
        </button>
        <button
          className={`action-btn ${status === 'visited' ? 'action-btn--active-visited' : ''}`}
          onClick={handleVisited}
          title="Mark as visited"
        >
          {status === 'visited' ? '✓' : '○'}
        </button>
      </div>
    </div>
  )
}
