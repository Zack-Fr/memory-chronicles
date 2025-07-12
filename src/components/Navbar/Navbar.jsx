import React from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className = {styles.navbar}> 
        <div className = {styles.logo}> Memory Chronicles</div>

        <a href = "#features" className={styles.navItem}>Features</a>
        <a href = "#about" className={styles.navItem}>About</a>
        <a href = "#contact" className={styles.navItem}>Contact</a>
        </nav>
    );
}