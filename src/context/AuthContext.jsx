import React, { createContext, useState, useEffect, useContext} from 'react'
import * as authService from '../services/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    //on mount: if there's a token, fetch the current user
    useEffect(()=> {
        const initAuth = async () =>{
            try {
                const token = localStorage.getItem('token')
                if(token) {
                    api.get('/auth/me')
                    .then(({ data }) => setUser(data.data.user))
                    .catch(() => logout())
                }
            } catch (err) {
                console.error('Auth init failed', err)
                authService.logout()
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])
    
    //register user
    const register = async creds => {
        const { user: newUser } = await authService.login(creds)
        setUser(newUser)
        return newUser
    }
    //login user
    const login = async creds => {
        const { user: newUser} = await authService.login(creds)
        setUser(newUser)
        return newUser
    }
    //logout
    const logout = () => {
        authService.logout()
        setUser(null)
    }
    return (
        <AuthContext.Provider
        value={{user, loading, register, login, logout}}
        >
            {children}
        </AuthContext.Provider>
    )
}
//Custom hook for easy consumption
export function useAuth() {
    return useContext(AuthContext)
}