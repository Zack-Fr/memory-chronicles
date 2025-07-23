import React from "react";
import styles from '../Button/Button.module.css'

export default function Buttons ({
children,
type = 'button',
onClick,
className = ''
}){
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${styles.button} ${className}`}
        >
            {children}
        </button>
    )
}