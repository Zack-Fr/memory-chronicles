// src/components/Attachments/AudioRecorder/AudioRecorder.jsx
import React, { useEffect } from 'react'
import { Mic2, StopCircle } from 'lucide-react'
import useMediaRecorder from '../../../hooks/useMediaRecorder'
import styles from './AudioRecorder.module.css'

export default function AudioRecorder({ onRecordComplete }) {
const { recording, audioBlob, audioUrl, start, stop } =
    useMediaRecorder()

  // Notify parent when recording finishes
useEffect(() => {
    if (audioBlob) onRecordComplete(audioBlob)
}, [audioBlob, onRecordComplete])

return (
    <div className={styles.container}>
    {!recording ? (
        <button
        type="button"
        className={styles.btn}
        onClick={start}
        title="Record Audio"
        >
        <Mic2 size={20} />
        </button>
    ) : (
        <button
        type="button"
        className={styles.btn}
        onClick={stop}
        title="Stop Recording"
        >
        <StopCircle size={20} />
        </button>
    )}

    {audioUrl && (
        <audio controls src={audioUrl} className={styles.audioPlayer} />
    )}
    </div>
)
}
