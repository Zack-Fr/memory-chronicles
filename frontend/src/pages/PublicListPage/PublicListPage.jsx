import leftArrow  from '../../assets/images/Nav_ArrowLeft.svg'
import rightArrow from '../../assets/images/Nav_ArrowRight.svg'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate }    from 'react-router-dom'
import ScrollFrame                    from '../../components/ScrollFrame/ScrollFrameVertical'
import Button                         from '../../components/Button/Button'
import { MapPin, Image as ImageIcon, Music, Mic2 } from 'lucide-react'
import { getPublicCapsules }          from '../../services/capsules'
import styles                         from './PublicListPage.module.css'



export default function PublicListPage() {
  const { countryCode } = useParams()
  const navigate        = useNavigate()

  const [capsules, setCapsules]     = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  const [mood, setMood]         = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')

  useEffect(() => {
    async function fetchCapsules() {
      setLoading(true)
      setError('')
      try {
        const filters = { country: countryCode }
        if (mood)      filters.mood      = mood
        if (dateFrom)  filters.date_from = dateFrom
        if (dateTo)    filters.date_to   = dateTo

        const data = await getPublicCapsules(filters)
        setCapsules(data)
        setSelectedId(data[0]?.id ?? null)
      } catch (err) {
        console.error(err)
        setError(err.response?.data?.message || 'Failed to load public capsules.')
      } finally {
        setLoading(false)
      }
    }
    fetchCapsules()
  }, [countryCode, mood, dateFrom, dateTo])

  if (loading) return <p className={styles.message}>Loading {countryCode}…</p>
  if (error)   return <p className={styles.error}>{error}</p>

  const selected = capsules.find(c => c.id === selectedId)

  return (
    <div className={styles.container}>
      {/* ← Left arrow */}
      <div
        className={styles.arrowLeft}
        data-tooltip="Back to the world map"
        onClick={() => navigate('/map')}
      >
        <img src={leftArrow} alt="" />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <label>
          Mood:
          <select value={mood} onChange={e => setMood(e.target.value)}>
            <option value="">All</option>
            <option value="happy">😊 Happy</option>
            <option value="neutral">😐 Neutral</option>
            <option value="sad">☹️ Sad</option>
          </select>
        </label>
        <label>
          From:
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </label>
      </div>

      <div className={styles.inner}>
        {/* Left panel: titles */}
        <ScrollFrame className={styles.scroll}>
          <h3 className={styles.scrollTitle}>Country: {countryCode}</h3>
          <p className={styles.statsLabel}>
            Number of Public Chronicles: {capsules.length}
          </p>
          <p className={styles.listTitle}>Titles:</p>

          <ol className={styles.list}>
            {capsules.map(c => (
              <li key={c.id}>
                <button
                  className={`${styles.listItem} ${
                    c.id === selectedId ? styles.activeItem : ''
                  }`}
                  onClick={() => setSelectedId(c.id)}
                  title={`Unlocked on ${new Date(
                    c.reveal_at
                  ).toLocaleDateString()}`}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ol>
        </ScrollFrame>

        {/* Right panel: detail */}
        <ScrollFrame className={styles.scroll}>
          <h3 className={styles.scrollTitle}>Message info:</h3>
          {selected ? (
            <div className={styles.detail}>
              <p>
                <strong>Title:</strong> {selected.title}
              </p>
              <p>
                <strong>Written:</strong>{' '}
                {new Date(selected.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Unlocked:</strong>{' '}
                {new Date(selected.reveal_at).toLocaleDateString()}
              </p>
              <p>
                <strong>User:</strong> {selected.user?.name}
              </p>
              <p>
                <strong>Location:</strong>{' '}
                {selected.location
                  ? `${selected.location.lat.toFixed(
                      3
                    )}, ${selected.location.lng.toFixed(3)}`
                  : '—'}
              </p>
              <p>
                <strong>Attached:</strong>
              </p>
              <div className={styles.iconRow}>
                {selected.location && <MapPin size={20} />}
                {selected.image_url && <ImageIcon size={20} />}
                {selected.audio_url && <Music size={20} />}
                {selected.recording_url && <Mic2 size={20} />}
              </div>
              <div className={styles.actions}>

              </div>
            </div>
          ) : (
            <p className={styles.message}>Select a title to see details.</p>
          )}
        </ScrollFrame>
      </div>

      {/* → Right arrow */}
      <div
        className={styles.arrowRight}
        data-tooltip="Read"
        onClick={() => navigate(`/capsules/${selected.id}`)}
      >
        <img src={rightArrow} alt="" />
      </div>
    </div>
  )
}

