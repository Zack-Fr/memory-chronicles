import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame'
import { getUserCapsules } from '../../services/capsules'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
const [capsules, setCapsules] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
    const fetchCapsules = async () => {
    try {
        const data = await getUserCapsules()
        setCapsules(data)
    } catch (err) {
        console.error(err)
        setError('Failed to load your capsules.')
    } finally {
        setLoading(false)
    }
    }
    fetchCapsules()
}, [])

const publicCapsules = capsules.filter(c => c.visibility === 'public')
const privateCapsules = capsules.filter(c => c.visibility === 'private')

if (loading) return <p className={styles.message}>Loading your capsules…</p>
if (error)   return <p className={styles.messageError}>{error}</p>

return (
    <div className={styles.container}>
    <div className={styles.inner}>
        <ScrollFrame className={styles.scroll}>
        <h3 className={styles.scrollTitle}>Public Chronicles</h3>
        <ol className={styles.list}>
            {publicCapsules.map(c => (
            <li key={c.id}>
                <Link to={`/capsule/${c.id}`} className={styles.link}>
                {c.title}
                </Link>
            </li>
            ))}
        </ol>
        </ScrollFrame>

        <ScrollFrame className={styles.scroll}>
        <h3 className={styles.scrollTitle}>Private Chronicles</h3>
        <ol className={styles.list}>
            {privateCapsules.map(c => (
            <li key={c.id}>
                <Link to={`/capsule/${c.id}`} className={styles.link}>
                {c.title}
                </Link>
            </li>
            ))}
        </ol>
        </ScrollFrame>
    </div>
    </div>
)
}

