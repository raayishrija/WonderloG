import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const BucketContext = createContext(null)

export function BucketProvider({ children }) {
  const { user } = useAuth()

  const getKey = (type) => user ? `wl_${type}_${user.email}` : null

  const [wishlist, setWishlist] = useState([])
  const [visited, setVisited] = useState([])

  // Load per-user data when user changes
  useEffect(() => {
    if (user) {
      const wKey = getKey('wishlist')
      const vKey = getKey('visited')
      setWishlist(JSON.parse(localStorage.getItem(wKey) || '[]'))
      setVisited(JSON.parse(localStorage.getItem(vKey) || '[]'))
    } else {
      setWishlist([])
      setVisited([])
    }
  }, [user])

  const saveWishlist = (list) => {
    if (!user) return
    setWishlist(list)
    localStorage.setItem(getKey('wishlist'), JSON.stringify(list))
  }

  const saveVisited = (list) => {
    if (!user) return
    setVisited(list)
    localStorage.setItem(getKey('visited'), JSON.stringify(list))
  }

  const addToWishlist = (country) => {
    if (wishlist.find(c => c.cca3 === country.cca3)) return
    const updated = [...wishlist, country]
    saveWishlist(updated)
    // Remove from visited if present
    if (visited.find(c => c.cca3 === country.cca3)) {
      saveVisited(visited.filter(c => c.cca3 !== country.cca3))
    }
  }

  const addToVisited = (country) => {
    if (visited.find(c => c.cca3 === country.cca3)) return
    const updatedVisited = [...visited, country]
    saveVisited(updatedVisited)
    // Remove from wishlist if present
    if (wishlist.find(c => c.cca3 === country.cca3)) {
      saveWishlist(wishlist.filter(c => c.cca3 !== country.cca3))
    }
  }

  const removeFromWishlist = (cca3) => saveWishlist(wishlist.filter(c => c.cca3 !== cca3))
  const removeFromVisited  = (cca3) => saveVisited(visited.filter(c => c.cca3 !== cca3))

  const getStatus = (cca3) => {
    if (visited.find(c => c.cca3 === cca3))  return 'visited'
    if (wishlist.find(c => c.cca3 === cca3)) return 'wishlist'
    return null
  }

  const totalWishlistPop = wishlist.reduce((sum, c) => sum + (c.population || 0), 0)
  const totalVisitedPop  = visited.reduce((sum, c)  => sum + (c.population || 0), 0)

  return (
    <BucketContext.Provider value={{
      wishlist, visited,
      addToWishlist, addToVisited,
      removeFromWishlist, removeFromVisited,
      getStatus, totalWishlistPop, totalVisitedPop,
    }}>
      {children}
    </BucketContext.Provider>
  )
}

export function useBucket() {
  return useContext(BucketContext)
}
