import React from 'react'
import styles from './TextArea.module.css'

export default function TextArea ({label, value, onChange, placeholder ='', rows = 4, id, className = ''}) {
    return (
        <div className = {styles.container}>
            {label && (
                <label htmlFor={id} className = {styles.label}>
                    {label}
                </label>
            )}
            <textarea
                id={id}
                value={value}
                onChange = {onChange}
                placeholder={placeholder}
                rows={rows}
                className = {`${styles.textarea} ${className}`}
            />

        </div>
    )
}