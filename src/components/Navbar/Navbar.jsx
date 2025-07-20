import React from 'react';
import{ Link } from 'react-router-dom'
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className = {styles.navbar}>
            <div className={styles.logo}>
            <img
            src={null}
            alt="Logo"
            className={styles.logoImg}
            />

            <span className = {styles.title}>Memory Chronicles</span>
        </div>
        
        <div className={styles.navLinks}>
        <Link to ="/auth" className={styles.navItem}>My Chronicles</Link>

        <Link to = "#about" className={styles.navItem}>About</Link>

        <Link to = "#contact" className={styles.navItem}>Contact</Link>
        </div>
        </nav>
    );
}