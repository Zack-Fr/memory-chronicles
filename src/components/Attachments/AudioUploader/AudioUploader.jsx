import React, {useRef } from "react";
import {Upload} from 'lucide-react'
import styles from './AudioUploader.module.css'

export default function AudioUploader ({ onUpload }) {
    const inputRef = useRef()

    

    const handleChange = e => {
        const file = e.target.files[0]
        if (file) onUpload(file)
    }

    return  (

        <div className ={styles.container}>
            
            <input
            type="file"
            accept = "audio/*"
            ref={inputRef}
            onChange={handleChange}
            className={styles.input}
            />

            <button
            type = "button"
            className ={styles.btn}
            onClick={()=> inputRef.current.click()}
            title = "Upload Audio"
            >

            <Upload size={20} />
            </button>
        </div>
    )}