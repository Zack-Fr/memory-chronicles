import React from "react";
import styles from './ScrollFrame.module.css'




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
            <img src = "../../assets/images/Navbar_Art.png"
            alt = ""
            className={styles.rollerTop}
            />
            {/* Parchment body */}
            <div className={styles.content}>{children}</div>
            {/* Bottom roller graphic */}
            <img
            src="../../assets/images/Navbar_Art.png"
            alt=""
            className={styles.rollerBottom}
            />

        </div>
    )
}
