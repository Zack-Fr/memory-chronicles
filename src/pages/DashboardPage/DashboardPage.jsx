import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link }                from 'react-router-dom'
import { toast, ToastContainer }             from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ScrollFrameVertical                  from '../../components/ScrollFrame/ScrollFrameVertical'
import Countdown                            from '../../components/Countdown/Countdown'
import { getUserCapsules }                  from '../../services/capsules'
import styles                               from './DashboardPage.module.css'

// your arrow SVGs
import leftArrow  from '../../assets/images/Nav_ArrowLeft.svg'
import rightArrow from '../../assets/images/Nav_ArrowRight.svg'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [hoveredId, setHoveredId] = useState(null)

  // ref to scroll the active item into view if desired
const listRef = useRef(null)

useEffect(() => {
    getUserCapsules()
    .then(data => setCapsules(data))
    .catch(() => setError('Failed to load your capsules.'))
    .finally(() => setLoading(false))
}, [])

const handleClick = c => {
    const revealDate = new Date(c.reveal_at)
    if (revealDate > new Date()) {
      toast.info(`Unlocks at ${revealDate.toLocaleString()}`, {
        position: 'top-center'
      })
    } else {
      navigate(`/capsules/${c.id}`)
    }
  }

  if (loading) return <p className={styles.message}>Loading your capsules…</p>
  if (error)   return <p className={styles.messageError}>{error}</p>

  const publicCapsules  = capsules.filter(c => c.privacy === 'public')
  const privateCapsules = capsules.filter(c => c.privacy === 'private')

  const renderList = list => (
    <ol className={styles.list} ref={listRef}>
      {list.map(c => {
        const revealDate = new Date(c.reveal_at)
        const isUnlocked = revealDate <= new Date()
        return (
          <li
            key={c.id}
            className={styles.listItem}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              type="button"
              onClick={() => handleClick(c)}
              className={styles.link}
              title={isUnlocked
                ? 'Click to read'
                : `Unlocks on ${revealDate.toLocaleDateString()}`}
            >
              {c.title}
            </button>

            {hoveredId === c.id && !isUnlocked && (
              <Countdown targetDate={c.reveal_at} />
            )}

            {!isUnlocked && (
              <span className={styles.lockBadge}>🔒</span>
            )}
          </li>
        )
      })}
    </ol>
  )

  return (
    <div className={styles.container}>
      <ToastContainer />

      {/* ← back to map */}
      <Link to="/map" className={styles.arrowLeft} data-tooltip="World Map">
        <img src={leftArrow} alt="" />
      </Link>

      <div className={styles.inner}>
        <ScrollFrameVertical className={styles.scroll}>
          <h3 className={styles.scrollTitle}>Public Chronicles</h3>
          {publicCapsules.length
            ? renderList(publicCapsules)
            : <p className={styles.message}>No public capsules yet.</p>}
        </ScrollFrameVertical>

        <ScrollFrameVertical className={styles.scroll}>
          <h3 className={styles.scrollTitle}>Private Chronicles</h3>
          {privateCapsules.length
            ? renderList(privateCapsules)
            : <p className={styles.message}>No private capsules yet.</p>}
        </ScrollFrameVertical>
      </div>

      {/* → write a new one */}
      <Link to="/write" className={styles.arrowRight} data-tooltip="Write Your Own">
        <img src={rightArrow} alt="" />
      </Link>
    </div>
  )
}
