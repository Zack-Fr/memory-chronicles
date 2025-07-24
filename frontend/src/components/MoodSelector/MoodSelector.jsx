import React from "react";
import styles from './MoodSelector.module.css'
import { Smile, Meh, Frown } from 'lucide-react'

const moods =[
    {value :'happy', Icon: Smile, label: 'Happy'},
    {value: 'neutral', Icon: Meh, label: 'Neutral'},
    {value: 'sad', Icon: Frown, label: 'Sad'}
]

export default function MoodSelector({ value, onChange }) {
    const handleClick = moodValue => {
        const newValue = value === moodValue ? null:moodValue
        console.log ('Mood selected', newValue)
        onChange(newValue)
    }
return (
    <div className={styles.moodGroup}>
    {moods.map(({ value: moodValue, Icon, label }) => {
        const isActive = value === moodValue
        return (
        <button
            key={moodValue}
            type="button"
            aria-pressed={value == moodValue}
            className={`${styles.moodBtn} ${isActive ? styles.active : ''}`}
            onClick={() => handleClick(moodValue)}
            title={label}
        >
            <Icon />
        </button>
        )
    })}
    </div>
)
}

