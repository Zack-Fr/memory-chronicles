import React from 'react';
import styles from './Navbar.module.css';
import logo from '../../assets/images/logo.svg';

export default function Navbar() {
    return (
        <nav className = {styles.navbar}>
            <img
            src={logo}
            alt="memory"
            className={styles.logo} />

        <a href = "#features" className={styles.navItem}>My Chronicles</a>
        <a href = "#about" className={styles.navItem}>About</a>
        <a href = "#contact" className={styles.navItem}>Contact</a>
        </nav>
    );
}