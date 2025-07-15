import React from "react";
import styles from './MoodSelector.module.css'
import { Smile, Meh, Frown } from 'lucide-react'

const moods =[
    {value :'happy', Icon: Smile, label: 'Happy'},
    {value: 'neural', Icon: Meh, label: 'Neural'},
    {value: 'sad', Icon: Frown, label: 'Sad'}
]

export default function MoodSelector({ value, onChange }) {
return (
/* This code snippet is creating a group of buttons for selecting different moods. */
    <div className={styles.moodGroup}>
    {moods.map(({ value: moodValue, Icon, label }) => (
        <button
        key={moodValue}
        type="button"
        aria-pressed={value === moodValue}
        className={`${styles.moodBtn} ${
            value === moodValue ? styles.active : ''
        }`}
        onClick={() => 
            onChange(value === moodValue ? null : moodValue)}
        title={label}
        >
        <Icon />
        </button>
    ))}
    </div>
)
}

