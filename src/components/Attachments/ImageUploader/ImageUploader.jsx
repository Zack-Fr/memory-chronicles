import React, { useRef, useState } from "react";
import {Image as ImageIcon} from 'lucide-react'
import styles from './ImageUploader.module.css'



export default function ImageUploader ({ onUpload}) {
    const inputRef = useRef()
    const [preview, setPreview] =  useState('')

    const handleChange = e => {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
            onUpload(file)
        }
    }
    return (
        <div className = {styles.container}>
            <input
            type= "file"
            accept = "image/*"
            ref = {inputRef}
            onChange = {handleChange}
            className = {styles.input}
        />
        <button 
        
        type="button"
        className={styles.btn}
        onClick = {()=>inputRef.current.click()}
        title= "Upload Image"
        >
        <ImageIcon size = {20}/>
        </button>
        {preview && (
            <img
            src = {preview}
            alt = "preview"
            className={styles.preview}
            />
        )}    
        </div>
    )
}