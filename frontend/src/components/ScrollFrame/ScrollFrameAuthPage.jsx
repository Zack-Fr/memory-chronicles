import React from "react";
import styles from './ScrollFrameAuthPage.module.css'




export default function ScrollFrame({ children, className = '' }) {
return (
    <div
    className={[
        styles.ScrollFrame,
        className,
         // NEW: when hideRollers is true, add our helper class
        ...(typeof className === 'object' && className.hideRollers
        ? [styles.hideRollers]
        : [])
    ].join(' ')}
    >
            <img src = "../../assets/images/NavBar_art.png"
            alt = ""
            className={styles.rollerTop}
            />
            {/* Parchment body */}
            <div className={styles.content}>{children}</div>
            {/* Bottom roller graphic */}
            <img
            src="../../assets/images/NavBar_art.png"
            alt=""
            className={styles.rollerBottom}
            />

        </div>
    )
}
