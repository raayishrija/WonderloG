import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCountryDetail } from '../hooks/useCountries'
import { useBucket } from '../context/BucketContext'
import './CountryDetailPage.css'

const fmt = (n) => n?.toLocaleString() || '—'
const fmtArea = (n) => n ? `${n.toLocaleString()} km²` : '—'

export default function CountryDetailPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { country, loading, error } = useCountryDetail(code)
  const { getStatus, addToWishlist, addToVisited, removeFromWishlist, removeFromVisited } = useBucket()

  const status = country ? getStatus(country.cca3) : null

  if (loading) return (
    <div className="detail-loading">
      <div className="spinner" />
      <p className="text-muted" style={{ marginTop: 16 }}>Loading country data…</p>
    </div>
  )

  if (error || !country) return (
    <div className="detail-error">
      <div style={{ fontSize: 56 }}>🌐</div>
      <h2>Country not found</h2>
      <p className="text-muted">{error}</p>
      <button className="btn btn-primary" onClick={() => navigate('/explore')}>← Back to Explore</button>
    </div>
  )

  const languages = country.languages ? Object.values(country.languages).join(', ') : '—'
  const currencies = country.currencies
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
    : '—'

  const handleWishlist = () => {
    if (status === 'wishlist') removeFromWishlist(country.cca3)
    else addToWishlist(country)
  }

  const handleVisited = () => {
    if (status === 'visited') removeFromVisited(country.cca3)
    else addToVisited(country)
  }

  return (
    <div className="detail-page">
      {/* Top bar */}
      <div className="detail-topbar">
        <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="detail-breadcrumb text-sm text-muted">
          {country.region} › {country.subregion || country.region}
        </div>
      </div>

      <div className="detail-layout">
        {/* Left column */}
        <div className="detail-left">
          {/* Flag hero */}
          <div className="flag-hero">
            <img
              src={country.flags?.svg || country.flags?.png}
              alt={`${country.name.common} flag`}
            />
          </div>

          {/* Status & actions */}
          <div className="detail-actions-card">
            {status && (
              <div className={`detail-status detail-status--${status}`}>
                {status === 'visited' ? '✓ You\'ve visited this country' : '♥ On your wishlist'}
              </div>
            )}
            <div className="detail-actions">
              <button
                className={`detail-action-btn ${status === 'wishlist' ? 'active-wish' : ''}`}
                onClick={handleWishlist}
              >
                <span className="action-icon">{status === 'wishlist' ? '♥' : '♡'}</span>
                <span>{status === 'wishlist' ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <button
                className={`detail-action-btn ${status === 'visited' ? 'active-visited' : ''}`}
                onClick={handleVisited}
              >
                <span className="action-icon">{status === 'visited' ? '✓' : '○'}</span>
                <span>{status === 'visited' ? 'Mark as Not Visited' : 'Mark as Visited'}</span>
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="qs-label text-xs text-muted">Population</div>
              <div className="qs-value">👥 {fmt(country.population)}</div>
            </div>
            <div className="quick-stat">
              <div className="qs-label text-xs text-muted">Area</div>
              <div className="qs-value">📐 {fmtArea(country.area)}</div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="detail-right animate-fade-up">
          <div className="detail-region-tag">
            <span className="badge badge-amber">{country.region}</span>
            {country.subregion && <span className="badge badge-ocean">{country.subregion}</span>}
          </div>

          <h1 className="detail-name">{country.name.common}</h1>
          {country.name.official !== country.name.common && (
            <p className="detail-official text-muted text-sm">{country.name.official}</p>
          )}

          <div className="detail-info-grid">
            <InfoRow icon="🏙" label="Capital" value={country.capital?.join(', ') || '—'} />
            <InfoRow icon="🗣" label="Languages" value={languages} />
            <InfoRow icon="💰" label="Currency" value={currencies} />
            <InfoRow icon="🌐" label="Domain" value={country.tld?.join(', ') || '—'} />
            {country.borders?.length > 0 && (
              <InfoRow icon="🗺" label="Borders" value={`${country.borders.length} countries`} />
            )}
          </div>

          {country.borders?.length > 0 && (
            <div className="borders-section">
              <h3 className="section-title">Bordering Countries</h3>
              <div className="borders-list">
                {country.borders.map(b => (
                  <button
                    key={b}
                    className="border-chip"
                    onClick={() => navigate(`/country/${b}`)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {country.latlng && (
            <div className="coords-section">
              <h3 className="section-title">Coordinates</h3>
              <p className="text-sm text-muted">
                {country.latlng[0].toFixed(2)}°{country.latlng[0] >= 0 ? 'N' : 'S'},
                {' '}{country.latlng[1].toFixed(2)}°{country.latlng[1] >= 0 ? 'E' : 'W'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <span className="info-icon">{icon}</span>
      <div>
        <div className="info-label text-xs text-muted">{label}</div>
        <div className="info-value text-sm">{value}</div>
      </div>
    </div>
  )
}
