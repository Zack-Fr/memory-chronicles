import React from "react";
import {Globe, Users, Link2} from 'lucide-react'
import styles from './VisibilitySelector.module.css'
const options = [
    {value: 'public', Icon: Globe, label:'Public'},
    {value: 'public', Icon: Users, label:'Friends'},
    {value: 'public', Icon: Link2, label:'Unlisted'}
]

export default function VisibilitySelector({ value, onChange }) {
return (
    <div className={styles.visGroup}>
    {options.map(({ value: optValue, Icon, label }) => (
        <button
        key={optValue}
        type="button"
        aria-pressed={value === optValue}
        className={`${styles.visBtn} ${
            value === optValue ? styles.active : ''
        }`}
        onClick={() => 
            onChange(value === optValue ? null:optValue)
        }
        title={label}
        >
        <Icon />
        </button>
    ))}
    </div>
)
}
