import React, { useState } from 'react'
import TextInput from '../../components/Input/FormControls/TextInput/TextInput'
import PasswordInput from '../../components/Input/FormControls/PasswordInput/PasswordInput'
import Button from '../../components/Button/Button'
import styles from './LoginForm.module.css'

export default function LoginForm({ onSubmit }) {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const handleSubmit = e => {
    e.preventDefault()
    console.log('Login:', { email, password })
    if (onSubmit) onSubmit({ email, password })
}

return (
    <form onSubmit={handleSubmit} className={styles.form}>
    <TextInput
        id="login-email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
    />
    <PasswordInput
        id="login-password"
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
    />
    <div className={styles.forgotWrapper}>
        <a href="#" className={styles.forgot}>Forgot password?</a>
    </div>
    <Button type="submit">Login</Button>
    </form>
)
}
