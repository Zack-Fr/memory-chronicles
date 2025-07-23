import React from "react";
import styles from './DateInput.module.css'

export default function DateInput({label, value, onChange, id, className =''}){
    return (
        <div className={styles.container}>
        {label && (

            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            )}
            <input
            id={id}
            type="date"
            value={value}
            onChange={onChange}
            className={`${styles.dateInput} ${className}`}
            />
            </div>
            )
        }


        