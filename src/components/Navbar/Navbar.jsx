// src/components/Navbar/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link to="/auth" className={styles.navItem}>My Chronicles</Link>
      <Link to="/" className={styles.logo}>Memory Chronicles</Link>
        <Link to="/map" className={styles.navItem}>Worldwide Map</Link>
        {/* <Link to="/about" className={styles.navItem}>About</Link> */}
      </div>
    </nav>
  )
}
