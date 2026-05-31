import { useState, useEffect } from 'react'

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('https://countriesnow.space/api/v0.1/countries/info?returns=name,flag,capital,region,population,area,iso3')
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) {
          // Map new API format to match your existing component format
          const data = json.data.map(c => ({
            cca3: c.iso3,
            name: { common: c.name },
            flags: { svg: c.flag, png: c.flag },
            region: c.region || '—',
            population: c.population || 0,
            capital: c.capital ? [c.capital] : [],
            area: c.area || 0,
          })).sort((a, b) => a.name.common.localeCompare(b.name.common))
          setCountries(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [])

  return { countries, loading, error }
}

export function useCountryDetail(code) {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!code) return
    let cancelled = false
    setLoading(true)
    fetch('https://countriesnow.space/api/v0.1/countries/info?returns=name,flag,capital,region,population,area,iso3')
      .then(res => res.json())
      .then(json => {
        const found = json.data.find(c => c.iso3 === code)
        if (!found) throw new Error('Country not found')
        // Map to match your existing format
        const mapped = {
          cca3: found.iso3,
          name: { common: found.name },
          flags: { svg: found.flag, png: found.flag },
          region: found.region || '—',
          population: found.population || 0,
          capital: found.capital ? [found.capital] : [],
          area: found.area || 0,
        }
        if (!cancelled) { setCountry(mapped); setLoading(false) }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [code])

  return { country, loading, error }
}