import { useState, useEffect } from 'react'

const FIELDS = 'name,flags,cca3,region,subregion,population,area,capital,currencies,languages,borders,tld,latlng'

export function useCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`https://restcountries.com/v3.1/all?fields=${FIELDS}`)
      .then(res => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (!cancelled) {
          setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)))
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
    fetch(`https://restcountries.com/v3.1/alpha/${code}?fields=${FIELDS}`)
      .then(res => {
        if (!res.ok) throw new Error(`Country not found`)
        return res.json()
      })
      .then(data => {
        if (!cancelled) { setCountry(data); setLoading(false) }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })
    return () => { cancelled = true }
  }, [code])

  return { country, loading, error }
}
