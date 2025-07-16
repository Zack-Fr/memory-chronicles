import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import AudioRecorder from '../../components/Attachments/AudioRecorder/AudioRecorder'
import AudioUploader from '../../components/Attachments/AudioUploader/AudioUploader'
import ImageUploader from '../../components/Attachments/ImageUploader/ImageUploader'

//services
import {sendLocation} from '../../services/location'
import { uploadAttachment} from '../../services/upload'

//styles
import styles from './MessageBoard.module.css'


export default function MessageBoard() {
    const navigate = useNavigate()
//form state
    const [title, setTitle] = useState('')
    const [unlockDate, setUnlockDate] = useState('')
    const [message, setMessage] = useState('')
    const [mood, setMood] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [location, setLocation] = useState(null)
    const [recording, setRecording] = useState(null)
    const [audioFile, setAudioFile] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const todayLabel= new Date().toLocaleDateString()

    const handleSubmit = async e=>{
        e.preventDefault()
        if(!message.trim()) {
            setError('please write something before sending.')
            return
        }
        setError('')
        setSubmitting(true)

        try {
            //send location if present
            let locationResult = null
            if(location){
                locationResult = await sendLocation(location)
            }
            //upload attachments
            const uploads = {}
            if (recording){
                const res = await uploadAttachment(recording)
                uploads.recordingUrl = res.url
            }
            if(uploadFile) {
                const res = await uploadAttachment (audioFile)
                uploads.audioUrl =res.url
            }
            if (imageFile){
                const res = await uploadAttachment(uploadFile)
                uploads.imageUrl = res.url
            }
            //build the draft payload
            const draft = {
                title,
                unlockDate,
                message,
                mood,
                visibility,
                ...(locationResult && {locationId: locationResult.id || locationResult}),
                ...uploads}

            navigate('/auth?mode=register&redirect=/dashboard',{state:{draft}
            })
        } catch (err) {
            console.error(err)
            setError(err.message || 'Submission Failed')
            setSubmitting(false)
        }
    }

    return (
        
        
        <div className={styles.container}>
            <ScrollFrame>
                <form onSubmit={handleSubmit} className={styles.inner}>
                    {/*////left pane////*/}
                    <div className={styles.leftPane}>
                        <div className={styles.topRow}>
                            <span className={styles.dateLabel}>Date: {todayLabel}</span>
            {/* TextInput */}
            <TextInput
            id="title"
            Label = ""
            placeholder="Title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            className={styles.pillInput}
            />
            {/* DateInput */}
            <DateInput
                id="unlock"
                label= ""
                value={unlockDate}
                onChange={e => setUnlockDate(e.target.value)}className={styles.pillInput}
                />
            </div>
            
            {/* textarea */}
            <div className={styles.textAreaWrapper}>
            <TextArea
                id = "messageBody"
                value = {message}
                onChange = {e => {setMessage(e.target.value)
                    if (error) setError('')
                }}
                placeholder = "start typing your memory..."
                rows={6}
                />

                <img
                src="/assets/clip-icon.svg"
                alt=""
                className={styles.clipIcon}
                />
            </div>
            {/* attachments */}
            <div className={styles.attachRow}>
                <LocationSelector value={location} onChange= {setLocation} />
                <AudioRecorder onRecordComplete={setRecording} />
                <AudioUploader onUpload={setAudioFile} />
                <ImageUploader onUpload={setImageFile} />
            </div>
            </div>

            {/*////Right pane////*/}
            <div className={styles.rightPane}>
                {error && <p className={styles.error}>{error}</p>}
            
            {/* moodSelector */}
            <div className={styles.selectorGroup}>
            <p className={styles.selectorLabel}>What is your current mood?</p>
                <MoodSelector value={mood} onChange={setMood} />
            </div>

                {/* visibility */}
                <div className = {styles.selectorGroup}>
                    <p className = {styles.selectorLabel}>
                        Select your message visibility status:
                    </p>
                    <VisibilitySelector 
                    value={visibility} 
                    onChange={setVisibility}/>
                </div>

                <div className={styles.sendButton}>
                    <p></p>
                <Button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send'}</Button>
                </div>
            </div>
        </form>
    </ScrollFrame>
    </div>
    )
}