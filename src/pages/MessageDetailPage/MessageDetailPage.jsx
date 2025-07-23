import React, { useEffect, useState } from 'react'
import { useParams, useNavigate }     from 'react-router-dom'
import ScrollFrameBody                from '../../components/ScrollFrame/ScrollFrameBody'
import Countdown                      from '../../components/Countdown/Countdown'
import Button                         from '../../components/Button/Button'
import { getCapsule, downloadZip }                 from '../../services/capsules'

// Lucide icons
import { MapPin, Smile, Meh, Frown, Globe, Lock } from 'lucide-react'
import styles from './MessageDetailPage.module.css'


export default function MessageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [capsule, setCapsule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    async function fetchCapsule() {
      try {
        const data = await getCapsule(id)
        setCapsule(data)
      } catch (err) {
        const msg = err.response?.data?.message || 'Cannot load message.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchCapsule()
  }, [id])

  if (loading) return <p className={styles.message}>Loading…</p>
  if (error)   return <p className={styles.messageError}>{error}</p>
  if (!capsule) return null

  const { body: message, reveal_at, mood, privacy, attachments = [] } = capsule
  const revealedAt = new Date(reveal_at)
  const isUnlocked = Date.now() >= revealedAt.getTime()

  const locationAttachment = attachments.find(a => a.type === 'location')

  const renderMood = m => {
    if (m === 'happy')  return <Smile  size={24} />
    if (m === 'neutral')return <Meh    size={24} />
    if (m === 'sad')    return <Frown  size={24} />
    return null
  }

  const renderVisibility = v => {
    if (v === 'public')  return <Globe size={24} />
    if (v === 'private') return <Lock  size={24} />
    return null
  }

  return (
    <div className={styles.container}>
      <ScrollFrameBody>
        {!isUnlocked ? (
          <div className={styles.locked}>
            <Countdown targetDate={reveal_at} />
          </div>
        ) : (
          <div className={styles.content}>
            <p className={styles.messageText}>{message}</p>

            <div className={styles.iconRow}>
              {mood    && <div className={styles.iconBtn} title={`Mood: ${mood}`}>{renderMood(mood)}</div>}
              {privacy && <div className={styles.iconBtn} title={`Visibility: ${privacy}`}>{renderVisibility(privacy)}</div>}
              {locationAttachment && (
                <div className={styles.iconBtn}
                    title={`Location: ${locationAttachment.latitude.toFixed(3)}, ${locationAttachment.longitude.toFixed(3)}`}>
                  <MapPin size={24} />
                </div>
              )}
            </div>

            <div className={styles.attachRow}>
              {attachments.map(att => {
                if (att.type === 'location') {
                  return (
                    <div key={att.id} className={styles.locationCard}>
                      <p>📍 Location</p>
                      <p>Lat: {att.latitude}</p>
                      <p>Lng: {att.longitude}</p>
                    </div>
                  )
                }

                if (att.type === 'image') {
                  return (
                    <img
                      key={att.id}
                      src={att.url}
                      alt="Attached"
                      className={styles.image}
                    />
                  )
                }

                if (att.type === 'audio') {
                  return (
                    <audio
                      key={att.id}
                      controls
                      src={att.url}
                      className={styles.audio}
                    />
                  )
                }

                return (
                  <div key={att.id} className={styles.unknownCard}>
                    <p>Unknown attachment type</p>
                  </div>
                )
              })}
            </div>

          <div className={styles.actions}>
            <Button onClick={()=>navigate('/write')}>Write A New Chronicle</Button>
  <Button onClick={()=>downloadZip(capsule.id)}>
    Download All Attachments
  </Button>
            </div>
          </div>
        )}
      </ScrollFrameBody>
    </div>
  )
}
