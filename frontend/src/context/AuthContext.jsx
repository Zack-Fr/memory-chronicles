import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'
import { upsertDraft } from '../services/capsules'



/* `export const AuthContext = createContext()` is creating a new context object using the
`createContext` function provided by React. This context object will be used to share the
authentication state and related functions (such as register, login, logout) throughout the
application. By exporting it, other components in the application can import and use this context to
access the authentication state and functions provided by the `AuthProvider`. */
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
const navigate = useNavigate()
const [user, setUser]     = useState(null)
const [loading, setLoading] = useState(true)

  // On mount, rehydrate user
useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
    apiClient.get('/auth/me')
        .then(res => setUser(res.data.data.user))
        .catch(() => logout())
    }
    setLoading(false)
}, [])

/**
   * After successful register, save any guest draft on the server
   * then clear it and navigate to dashboard.
   */
const register = async form => {
    const res = await apiClient.post('/auth/register', form)
    const { token, user } = res.data.data

    localStorage.setItem('token', token)
    setUser(user)

    // If guest left a draft, upsert it now:
    const draftJson = localStorage.getItem('guestDraft')
    if (draftJson) {
    try {
        const draft = JSON.parse(draftJson)
        await upsertDraft(draft)
        localStorage.removeItem('guestDraft')
    } catch (e) {
        console.error('Failed to save draft after register', e)
    }
    }

    navigate('/dashboard')
}

/**
   * After login, do the same draft-upsert.
   */
const login = async credentials => {
    const res = await apiClient.post('/auth/login', credentials)
    const { token, user } = res.data.data

    localStorage.setItem('token', token)
    setUser(user)

    const draftJson = localStorage.getItem('guestDraft')
    if (draftJson) {
    try {
        const draft = JSON.parse(draftJson)
        await upsertDraft(draft)
        localStorage.removeItem('guestDraft')
    } catch (e) {
        console.error('Failed to save draft after login', e)
    }
    }

    navigate('/dashboard')
}

const logout = async () => {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('token')
    setUser(null)
    navigate('/auth')
}
return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
    {children}
    </AuthContext.Provider>
)
}
export function useAuth() {
    return useContext(AuthContext)
}
