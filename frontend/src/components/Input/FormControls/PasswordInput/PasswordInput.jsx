import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './PasswordInput.module.css'

export default function PasswordInput({
id,
value,
onChange,
placeholder = '',
className = ''
}) {
    const [visible, setVisible] = useState(false)
    return (
        <div className = {styles.container}>
            <input
            id={id}
            type = {visible ? 'text' : 'password'}
            value = {value}
            onChange={onChange}
            placeholder={placeholder}
            className = {`${styles.input} $ {className}`}
            />
            <button type ="button"
            className={styles.icon}
            onClick={()=> setVisible(v => !v)}
            tabIndex={-1}
            >
                {visible ? <EyeOff size={20}/> : <Eye size={20} />}
            </button>
        </div>
    )
}