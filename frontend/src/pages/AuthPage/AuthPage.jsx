import React, { useState, useEffect } from 'react'
import ScrollFrame from '../../components/ScrollFrame/ScrollFrameAuthPage'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/Button/Button'
import styles from './AuthPage.module.css'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { useAuth } from '../../context/AuthContext'
import { createCapsule, getPublicCapsules } from '../../services/capsules'

export default function AuthPage() {
const [mode, setMode] = useState('register') // register
const [error, setError] = useState('')
const [publicCount, setPublicCount] = useState(0)
const{ register, login } = useAuth()
const navigate = useNavigate() 
const location = useLocation()
const draft = location.state?.draft
// Fetch real‐time public count
useEffect(() => {
    const fetchCount = async () => {
    try {
        const data = await getPublicCapsules()
        setPublicCount(data.length)
    } catch (err) {
        console.error('Failed to load public count', err)
    }
    }
    fetchCount()
}, [])
//after auth, if there's a draft, create the capsule before redirect
const resumeOrRedirect = async () => {
    try {
        if (draft) {
            await createCapsule(draft)
        }
        navigate('/dashboard')
    } catch (err) {
        console.error('Capsule creation failed', err)
        setError('Could not save your capsule. Please try again.')
    }
}

const handleRegister = async credentials => {
    setError('')
    try {
        await register(credentials)
        await resumeOrRedirect()
    } catch (err) {
        console.error('Register failed', err)
        setError(err.response?.data?.message || 'Registration failed')
    }
}

const handleLogin = async credentials => {
    setError('')
    try {
    await login(credentials)
    await resumeOrRedirect()
    } catch (err) {
    console.error('Login failed', err)
    setError(err.response?.data?.message || 'Login failed')
    }
}

return (
    <div className={styles.container}>
    <h2 className={styles.title}>Join our worldwide community</h2>

    <ScrollFrame>
        <div className={styles.inner}>
        
          {/* LEFT PANE: Register / Login */}
        <div className={styles.leftPane}>
            {/* Mode Tabs */}
            <div className={styles.tabs}>
            <button
                type="button"
                className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
                onClick={() => setMode('register')}
            >
                Register
            </button>
            <button
                type="button"
                className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
                onClick={() => setMode('login')}
            >
                Login
            </button>
            </div>

            {/* Display any auth or resume errors */}
            {error && <p className={styles.error}>{error}</p>}

            {/* The actual form */}
            {mode === 'register' ? (
            <RegisterForm onSubmit={handleRegister} />
            ) : (
            <LoginForm onSubmit={handleLogin} />
            )}
        </div>

          {/* RIGHT PANE: Stats & Quick Register */}
        <div className={styles.rightPane}>
            <p className={styles.statsLabel}>Number of Public Chronicles:</p>
            <p className={styles.statsNumber}>{publicCount}</p>
            <Button onClick={() => navigate('/map')}>
            World Map
            </Button>
        </div>
        </div>
    </ScrollFrame>
    </div>
)
}







