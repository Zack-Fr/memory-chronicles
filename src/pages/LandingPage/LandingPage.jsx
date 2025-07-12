import React from 'react'
import Question from '../../components/Question/Questions'
import Navbar from '../../components/Navbar/Navbar';
import styles from './LandingPage.module.css';

export default function LandingPage () {
    return (
        <div className={styles.hero}>
            
            <div className={styles.content}>
            {<Question />}
            </div>

            <div className={styles.backgroundPlaceholder}>
            {<Navbar />}
            </div>
        </div>
    )
}