import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
//form functions
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame' 
import TextInput from '../../components/Input/FormControls/TextInput/TextInput'
import DateInput from '../../components/Input/FormControls/DateInput/DateInput'
import TextArea from '../../components/Input/FormControls/TextArea/TextArea'
import Button from '../../components/Button/Button'

//Message features functions
import MoodSelector from '../../components/MoodSelector/MoodSelector'
import VisibilitySelector from '../../components/VisibilitySelector/VisibilitySelector'

//User Attachments functions
import LocationSelector from '../../components/Attachments/LocationSelector/LocationSelector'
import { AuthContext } from '../../context/AuthContext' 
import AudioRecorder from '../../components/Attachments/AudioRecorder/AudioRecorder'
import AudioUploader from '../../components/Attachments/AudioUploader/AudioUploader'
import ImageUploader from '../../components/Attachments/ImageUploader/ImageUploader'

//services
import {sendLocation} from '../../services/location'
import { uploadAttachment} from '../../services/upload'

//styles
import styles from './MessageBoard.module.css'


import {
getDraft,
upsertDraft,
createCapsule
} from '../../services/capsules'



export default function MessageBoardPage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)            // NEW: know if guest or auth

  // Form state
  const [title, setTitle]           = useState('')
  const [unlockDate, setUnlockDate] = useState('')
  const [message, setMessage]       = useState('')
  const [mood, setMood]             = useState(null)
  const [visibility, setVisibility] = useState('public')
  const [location, setLocation]     = useState(null)

  // UI state
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Load existing draft *only* for authenticated users
  useEffect(() => {
    if (!user) return

    async function loadDraft() {
      try {
        const draft = await getDraft()
        if (draft) {
          setTitle(draft.title || '')
          setUnlockDate(draft.reveal_at?.slice(0,10) || '')
          setMessage(draft.body || '')
          setMood(draft.mood || null)
          setVisibility(draft.privacy || 'public')
          const loc = draft.attachments?.find(a => a.type === 'location')
          if (loc) setLocation({ lat: loc.latitude, lng: loc.longitude })
        }
      } catch (err) {
        console.error('Failed to load draft', err)
      }
    }
    loadDraft()
  }, [user])

  // Final submit: either stash & redirect (guest) or call createCapsule (auth)
  const handleSubmit = async e => {
    e.preventDefault()
    setErrors({})

    // client‐side required checks
    if (!message.trim()) {
      setErrors({ body: ['Please write something before sending.'] })
      return
    }
    if (!location) {
      setErrors({ location: ['Location is required.'] })
      return
    }

    const payload = {
      title,
      body:      message,
      reveal_at: unlockDate,
      mood,
      privacy:   visibility,
      attachments: [
        { type:'location', latitude: location.lat, longitude: location.lng }
      ]
    }

    // GUEST path: save locally and send to register/login
    if (!user) {
      localStorage.setItem('guestDraft', JSON.stringify(payload))
      toast.info('Please sign up to save and send your message.')
      navigate('/auth')
      return
    }

    // AUTH path: call API
    setSubmitting(true)
    try {
      await createCapsule(payload)
      navigate('/dashboard')
    } catch (err) {
      const fieldErrors = err.response?.data?.errors || {}
      setErrors(fieldErrors)
      toast.error(err.response?.data?.message || 'Submission failed.')
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <ToastContainer />
      <ScrollFrame>
        <h2 className={styles.title}>Write Your Chronicle</h2>

        {/* Show top‐level errors */}
        {errors.general && <p className={styles.error}>{errors.general[0]}</p>}

        <form onSubmit={handleSubmit} className={styles.inner}>
          {/* Left pane */}
          <div className={styles.leftPane}>
            <div className={styles.topRow}>
              <span className={styles.dateLabel}>
                Date: {new Date().toLocaleDateString()}
              </span>
              <TextInput
                id="title"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                error={errors.title?.[0]}
                className={styles.pillInput}
              />
              <DateInput
                id="unlock"
                value={unlockDate}
                onChange={e => setUnlockDate(e.target.value)}
                placeholder="Unlock Date"
                className={styles.pillInput}
                error={errors.reveal_at?.[0]}
              />
            </div>

            <div className={styles.textareaWrapper}>
              <TextArea
                id="messageBody"
                value={message}
                onChange={e => {
                  setMessage(e.target.value)
                  if (errors.body) setErrors({...errors, body: null})
                }}
                placeholder="Start typing your memory…"
                rows={6}
                error={errors.body?.[0]}
              />
            </div>

            <div className={styles.attachRow}>
              <LocationSelector
                value={location}
                onChange={setLocation}
                error={errors.location?.[0]}
              />
              {/* you can re-enable audio/image later */}
            </div>
          </div>

          {/* Right pane */}
          <div className={styles.rightPane}>
            <div className={styles.selectorGroup}>
              <p className={styles.selectorLabel}>What is your current mood?</p>
              <MoodSelector
                value={mood}
                onChange={setMood}
                error={errors.mood?.[0]}
              />
            </div>

            <div className={styles.selectorGroup}>
              <p className={styles.selectorLabel}>Select visibility:</p>
              <VisibilitySelector
                value={visibility}
                onChange={setVisibility}
                error={errors.privacy?.[0]}
              />
            </div>

            {/* Only one “Send” button now */}
            <div className={styles.actions}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </div>
        </form>
      </ScrollFrame>
    </div>
  )
}