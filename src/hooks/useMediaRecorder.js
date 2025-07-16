import { useState, useRef } from 'react';
export default function useMediaRecorder () {
    const [recording, setRecording] = useState(false)
    const [audioBlob, setAudioBlob] =useState(null) //the final recording
    const [audioUrl, setAudioUrl] =useState('')//for playback
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true})
        mediaRecorderRef.current = new MediaRecorder (stream)

        chunksRef.current = []//for data chunks

/* This part of the code is setting up event handlers for the `MediaRecorder` object. */
        mediaRecorderRef.current.ondataavailable = e =>
            chunksRef.current.push(e.data)
        mediaRecorderRef.current.onstop = () => {
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
    const url = URL.createObjectURL(blob)
    setAudioBlob(blob)
    setAudioUrl(url)
    }

    mediaRecorderRef.current.start()
    setRecording(true)
}

const stop = () => {
    if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop()
    setRecording(false)
    }
}

return { recording, audioBlob, audioUrl, start, stop }
}