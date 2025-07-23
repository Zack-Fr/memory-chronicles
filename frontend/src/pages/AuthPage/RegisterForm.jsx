import React, { useState } from 'react'
import TextInput from '../../components/Input/FormControls/TextInput/TextInput'
import PasswordInput from '../../components/Input/FormControls/PasswordInput/PasswordInput'
import Button from '../../components/Button/Button'
import styles from './RegisterForm.module.css'

export default function RegisterForm({ onSubmit }) {
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const handleSubmit = e => {
    e.preventDefault()
    console.log('Register:', { name, email, password })
    if (onSubmit) onSubmit({ name, email, password })
}

return (
    <form onSubmit={handleSubmit} className={styles.form}>
    <TextInput
        id="register-name"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
    />
    <TextInput
        id="register-email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
    />
    <PasswordInput
        id="register-password"
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
    />
    <div className={styles.forgotWrapper}>
        <a href="#" className={styles.forgot}>Forgot password?</a>
    </div>
    <Button type="submit">Register</Button>
    </form>
)
}
