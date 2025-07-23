import React from "react";
import styles from './TextInput.module.css'

export default function TextInput({
    label,
    value,
    onChange,
    placeholder = '',
    type = 'text',
    id,
    className =''
}) {
    return (
        <div className = {styles.container}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${styles.input} ${className}`}
            />
        </div>
    )
}