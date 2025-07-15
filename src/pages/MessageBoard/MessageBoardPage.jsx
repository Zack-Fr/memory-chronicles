import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ScrollFrame from '../../components/ScrollFrame/ScrollFrame' 
import TextInput from '../../components/Input/FormControls/TextInput/TextInput'
import DateInput from '../../components/Input/FormControls/DateInput/DateInput'
import TextArea from '../../components/Input/FormControls/TextArea/TextArea'
import MoodSelector from '../../components/MoodSelector/MoodSelector'
import VisibilitySelector from '../../components/VisibilitySelector/VisibilitySelector'
import Button from '../../components/Button/Button'

import LocationSelector from '../../components/Attachments/LocationSelector/LocationSelector'
import AudioRecorder from '../../components/Attachments/AudioRecorder/AudioRecorder'
import AudioUploader from '../../components/Attachments/AudioUploader/AudioUploader'
import ImageUploader from '../../components/Attachments/ImageUploader/ImageUploader'

import styles from './MessageBoard.module.css'



export default function MessageBoard() {
    const navigate = useNavigate()

    
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
    const todayLabel= new Date().toLocaleDateString()

    const handleSubmit = e=>{
        e.preventDefault()
        if(!message.trim()) {
            setError('please write something before sending.')
            return
        }

        const draft ={
            title,
            unlockDate,
            message,
            mood,
            visibility,
            location,
            recording,
            audioFile,
            imageFile
        }
        navigate('/auth?mode=register&redirect=/dashboard',{state:{draft}
        })
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
                <Button type="submit">Send</Button>
                </div>
            </div>
        </form>
    </ScrollFrame>
    </div>
    )
}