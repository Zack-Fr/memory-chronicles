import React from "react";
import styles from './ScrollFrame.module.css'



export default function ScrollFrame({ children, className = '' }) {
    return (
        <div className = {`${styles.ScrollFrame} ${className}`}>
            <img src = "/assets/ScrollPaper_handle.png"
            alt = ""
            className={styles.rollerTop}
            />
            {/* Parchment body */}
            <div className={styles.content}>{children}</div>
            {/* Bottom roller graphic */}
            <img
            src="/assets/ScrollPaper_handle.png"
            alt=""
            className={styles.rollerBottom}
            />

        </div>
    )
}