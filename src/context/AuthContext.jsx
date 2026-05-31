import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const REQRES_API_KEY = 'free_user_3EV5Bzb4gVGV4Z8J9hmOxDzJpyR'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('wl_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': REQRES_API_KEY   // ← added
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      const userData = { email, token: data.token }
      setUser(userData)
      localStorage.setItem('wl_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch('https://reqres.in/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': REQRES_API_KEY   // ← added
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      const userData = { email, token: data.token, id: data.id }
      setUser(userData)
      localStorage.setItem('wl_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('wl_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}