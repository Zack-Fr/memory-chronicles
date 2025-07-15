import React from "react";
import {Globe, GlobeLock, Link2} from 'lucide-react'
import styles from './VisibilitySelector.module.css'
const options = [
    {value: 'public', Icon: Globe, label:'Public'},
    {value: 'private', Icon: GlobeLock, label:'Private'},
    {value: 'unlisted', Icon: Link2, label:'Unlisted'}
]

export default function VisibilitySelector({ value, onChange }) {
const handleClick = optValue => {
    const newValue = value === optValue ? null : optValue
    console.log('Visibility selected:', newValue)
    onChange(newValue)
}

return (
    <div className={styles.visGroup}>
    {options.map(({ value: optValue, Icon, label }) => {
        const isActive = value === optValue
        return (
        <button
        key={optValue}
        type="button"
        aria-pressed={value === optValue}
        className={`${styles.visBtn} ${isActive ? styles.active : ''}`}
        onClick={() => handleClick(optValue)}
        title={label}
        >
        <Icon />
        </button>
        )
    })}
    </div>
)
}