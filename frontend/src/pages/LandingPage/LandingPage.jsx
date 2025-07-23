import React from 'react'
import Question from '../../components/Question/Question'
import Navbar from '../../components/Navbar/Navbar';
import styles from './LandingPage.module.css';
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame'


export default function LandingPage () {
    return (
        <div className={styles.hero}>
            <div className={styles.navWrapper}>
            <Navbar />
            </div>

            <div className={styles.content}>
            {<Question />}
            </div>
            

            
            <div className={styles.backgroundPlaceholder}>
            </div>
        </div>
    )
}

