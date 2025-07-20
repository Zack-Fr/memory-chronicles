import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame'
import { getUserCapsules } from '../../services/capsules'
import Countdown from '../../components/Countdown/Countdown'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
const [capsules, setCapsules] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [hoveredId, setHoveredId] = useState(null)

useEffect(() => {
    const fetchCapsules = async () => {
    try {
        const data = await getUserCapsules()
        setCapsules(data)
    } catch (err) {
        console.error('Failed to load capsules', err)
        setError('Failed to load your capsules.')
    } finally {
        setLoading(false)
    }
    }
    fetchCapsules()
}, [])

if (loading) return <p className={styles.message}>Loading your capsules…</p>
if (error)   return <p className={styles.messageError}>{error}</p>

const publicCapsules = capsules.filter(c => c.privacy === 'public')
const privateCapsules = capsules.filter(c => c.privacy === 'private')
const renderList = list => (
    <ol className={styles.list}>
    {list.map(c => (
        <li
        key={c.id}
        className={styles.listItem}
        onMouseEnter={() => setHoveredId(c.id)}
        onMouseLeave={() => setHoveredId(null)}
        >
        <Link to={`/capsule/${c.id}`} className={styles.link}>
            {c.title}
        </Link>
        {hoveredId === c.id && (
            <Countdown targetDate={c.revealed_at} />
        )}
        </li>
    ))}
    </ol>
)
return (
    <div className={styles.container}>
    <div className={styles.inner}>
        <ScrollFrame className={styles.scroll}>
        <h3 className={styles.scrollTitle}>Public Chronicles</h3>
        {publicCapsules.length
            ? renderList(publicCapsules)
            : <p className={styles.message}>No public capsules yet.</p>}
        </ScrollFrame>

        <ScrollFrame className={styles.scroll}>
        <h3 className={styles.scrollTitle}>Private Chronicles</h3>
        {privateCapsules.length
            ? renderList(privateCapsules)
            : <p className={styles.message}>No private capsules yet.</p>}
        </ScrollFrame>
    </div>
    </div>
)
}









// return (
//     <div className={styles.container}>
//     <div className={styles.inner}>
//         <ScrollFrame className={styles.scroll}>
//         <h3 className={styles.scrollTitle}>Public Chronicles</h3>
//         <ol className={styles.list}>
//             {publicCapsules.map(c => (
//             <li key={c.id}>
//                 <Link to={`/capsule/${c.id}`} className={styles.link}>
//                 {c.title}
//                 </Link>
//             </li>
            
//             ))}
//         </ol>
//         </ScrollFrame>

//         <ScrollFrame className={styles.scroll}>
//         <h3 className={styles.scrollTitle}>Private Chronicles</h3>
//         <ol className={styles.list}>
//             {privateCapsules.map(c => (
//             <li key={c.id}>
//                 <Link to={`/capsule/${c.id}`} className={styles.link}>
//                 {c.title}
//                 </Link>
//             </li>
//             ))}
//         </ol>
//         </ScrollFrame>
//     </div>
//     </div>
// )