import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
//form functions
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame' 
import TextInput from '../../components/Input/FormControls/TextInput/TextInput'
import DateInput from '../../components/Input/FormControls/DateInput/DateInput'
import TextArea from '../../components/Input/FormControls/TextArea/TextArea'
import Button from '../../components/Button/Button'
import Navbar from '../../components/Navbar/Navbar'

//Message features functions
import MoodSelector from '../../components/MoodSelector/MoodSelector'
import VisibilitySelector from '../../components/VisibilitySelector/VisibilitySelector'
import {getDraft,upsertDraft,createCapsule} from '../../services/capsules'

//User Attachments functions
import LocationSelector from '../../components/Attachments/LocationSelector/LocationSelector'
import { AuthContext } from '../../context/AuthContext' 
import AudioRecorder from '../../components/Attachments/AudioRecorder/AudioRecorder'
import AudioUploader from '../../components/Attachments/AudioUploader/AudioUploader'
import ImageUploader from '../../components/Attachments/ImageUploader/ImageUploader'

//styles
import styles from './MessageBoard.module.css'


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

  const [recording, setRecording]   = useState(null)  // from AudioRecorder (Blob)
  const [audioFile, setAudioFile]   = useState(null)  // from AudioUploader (File)
  const [imageFile, setImageFile]   = useState(null)  // from ImageUploader (File)
  // UI state
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [saving, setSaving]         = useState(false)
  
  // Load existing draft *only* for authenticated users
  useEffect(() => {
    if (!user) return
    (async () => {
      try {
        const draft = await getDraft()
        if (draft) {
          setTitle(draft.title || '')
          setUnlockDate(draft.reveal_at?.slice(0,10) || '')
          setMessage(draft.body || '')
          setMood(draft.mood)
          setVisibility(draft.privacy)
          const loc = draft.attachments.find(a => a.type==='location')
          if (loc) setLocation({ lat: loc.latitude, lng: loc.longitude })

          // find image/audio attachments in draft
          const img = draft.attachments.find(a => a.type==='image')
          if (img) setImageFile({ url: img.url, filename: img.filename })
          const aud = draft.attachments.find(a => a.type==='audio')
          if (aud) setAudioFile({ url: aud.url, filename: aud.filename })
        }
      } catch{}
    })()
  }, [user])


    // helper to convert File or Blob → Base64
  const toBase64 = fileOrBlob => new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = () => res(reader.result.split(',')[1])
    reader.onerror = e => rej(e)
    reader.readAsDataURL(fileOrBlob)
  })

  // common: build attachments array
  const buildAttachments = async () => {
    const atts = []

    // location
    if (location) {
      atts.push({
        type: 'location',
        latitude:  location.lat,
        longitude: location.lng
      })
    }

    // image
    if (imageFile) {
      // imageFile might be a Blob from recorder or a File from uploader
      const { name, file, url } = imageFile.filename ? imageFile : { file: imageFile, name: imageFile.name }
      const base64 = await toBase64(file)
      atts.push({ type:'image', filename: name, base64 })
    }

    // audio
    if (recording || audioFile) {
      const blobOrFile = recording || audioFile.file || audioFile
      const name = recording
        ? `recording-${Date.now()}.webm`
        : audioFile.filename || audioFile.name
      const base64 = await toBase64(blobOrFile)
      atts.push({ type:'audio', filename: name, base64 })
    }

    return atts
  }

  // Upsert draft (debounced in real code!)
  const handleSaveDraft = async () => {
    setSaving(true)
    const payload = {
      title,
      body:      message,
      reveal_at: unlockDate,
      mood,
      privacy:   visibility,
      attachments: await buildAttachments()
    }
    try {
      await upsertDraft(payload)
      toast.success('Draft saved!')
    } catch {
      toast.error('Failed to save draft.')
    }
    setSaving(false)
  }

  // Final submit
  const handleSubmit = async e => {
    e.preventDefault()
    setErrors({})

    // same validations...
    if (!message.trim()) {
      setErrors({ body:['Please write something.'] })
      return
    }
    if (!location) {
      setErrors({ location:['Location required.'] })
      return
    }

    setSubmitting(true)
    const payload = {
      title,
      body:      message,
      reveal_at: unlockDate,
      mood,
      privacy:   visibility,
      attachments: await buildAttachments()
    }

    if (!user) {
      // guest: stash and redirect (same as before)...
      localStorage.setItem('guestDraft', JSON.stringify(payload))
      toast.info('Please register to save your message.')
      navigate('/auth',{ state:{ draft:payload } })
      return
    }

    try {
      await createCapsule(payload)
      navigate('/dashboard')
    } catch (err) {
      const errs = err.response?.data?.errors || {}
      setErrors(errs)
      toast.error(err.response?.data?.message||'Send failed.')
      setSubmitting(false)
    }
  }

  return (
    
    <div className={styles.container}>
                  <div className={styles.navWrapper}>
                  <Navbar />
                  </div>
              
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
              <AudioRecorder onRecordComplete={blob => setRecording(blob)} />
                <AudioUploader  onUpload={file => setAudioFile(file)} />
                  <ImageUploader  onUpload={file => setImageFile(file)} />
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
      </ScrollFrame >
    </div>
  )
}