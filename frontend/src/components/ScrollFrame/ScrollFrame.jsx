import React from "react";
import styles from './ScrollFrame.module.css'

export default function ScrollFrame({ children, className = '' }) {
return (
    <div className={`${styles.ScrollFrame} ${className}`.trim()}>
        <div className={styles.content}>{children}</div>
    </div>
    )
}
