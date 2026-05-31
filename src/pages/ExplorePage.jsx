import React, { useState, useMemo } from 'react'
import { useCountries } from '../hooks/useCountries'
import CountryCard from '../components/CountryCard'
import './ExplorePage.css'

const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']
const SORT_OPTIONS = [
  { value: 'name-asc',  label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'pop-desc',  label: 'Population ↓' },
  { value: 'pop-asc',   label: 'Population ↑' },
  { value: 'area-desc', label: 'Area ↓' },
]

export default function ExplorePage() {
  const { countries, loading, error } = useCountries()
  const [search, setSearch]   = useState('')
  const [region, setRegion]   = useState('All')
  const [sort, setSort]       = useState('name-asc')

  const filtered = useMemo(() => {
    let list = [...countries]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.common.toLowerCase().includes(q) ||
        c.capital?.[0]?.toLowerCase().includes(q) ||
        c.region?.toLowerCase().includes(q)
      )
    }
    if (region !== 'All') list = list.filter(c => c.region === region)

    const [key, dir] = sort.split('-')
    list.sort((a, b) => {
      let va, vb
      if (key === 'name')  { va = a.name.common; vb = b.name.common }
      if (key === 'pop')   { va = a.population || 0; vb = b.population || 0 }
      if (key === 'area')  { va = a.area || 0; vb = b.area || 0 }
      if (dir === 'asc') return typeof va === 'string' ? va.localeCompare(vb) : va - vb
      return typeof va === 'string' ? vb.localeCompare(va) : vb - va
    })
    return list
  }, [countries, search, region, sort])

  return (
    <div className="explore-page">
      {/* Header */}
      <div className="explore-header">
        <div className="explore-header-inner">
          <div>
            <h1 className="explore-title">Explore the World</h1>
            <p className="text-muted text-sm">
              {loading ? 'Loading countries…' : `${filtered.length} of ${countries.length} countries`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="explore-controls">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search by name, capital, region…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="region-tabs">
          {REGIONS.map(r => (
            <button
              key={r}
              className={`region-tab ${region === r ? 'active' : ''}`}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="explore-content">
        {error && (
          <div className="error-state">
            <div className="error-icon">⚠</div>
            <h3>Failed to load countries</h3>
            <p className="text-muted">{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="countries-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card-skeleton">
                <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%', borderRadius: 0 }} />
                <div style={{ padding: '14px 16px' }}>
                  <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, width: '55%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <h3>No countries found</h3>
            <p className="text-muted">Try adjusting your search or filter.</p>
            <button className="btn btn-outline" onClick={() => { setSearch(''); setRegion('All') }}>
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="countries-grid">
            {filtered.map((country, i) => (
              <CountryCard
                key={country.cca3}
                country={country}
                style={{ animationDelay: `${Math.min(i * 0.04, 0.8)}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
