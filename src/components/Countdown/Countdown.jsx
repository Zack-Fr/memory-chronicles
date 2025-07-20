import React, { useState, useEffect } from 'react'
import styles from './Countdown.module.css'

export default function Countdown({ targetDate }) {
const calculateTimeLeft = () => {
    const diff = new Date(targetDate).getTime() - Date.now()
    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    return { days, hours, minutes, seconds }
}

const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

useEffect(() => {
    const timer = setInterval(() => {
    setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
}, [targetDate])

if (!timeLeft) {
    return <div className={styles.container}>Revealed!</div>
}

return (
    <div className={styles.container}>
    {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
)
}
