import React, { useState } from 'react'
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from '../../components/Button/Button'
import styles from './AuthPage.module.css'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { useAuth } from '../../context/AuthContext'
import { createCapsule } from '../../services/capsules'

export default function AuthPage() {
const [mode, setMode] = useState('') // register or 'login'
const [error, setError] = useState('')
const{ register, login } = useAuth()
const navigate = useNavigate() 
const location = useLocation()
const draft = location.state?.draft

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
            <img
            src="/assets/globe.svg"
            alt="Globe"
            className={styles.globe}
            />
            <p className={styles.statsLabel}>Number of Public Chronicles:</p>
            <p className={styles.statsNumber}>23,500</p>
            <Button onClick={() => setMode('register')}>
            Register
            </Button>
        </div>
        </div>
    </ScrollFrame>
    </div>
)
}







