import React from 'react';
import logo from '../logo.png';
import styles from '../styles/Navbar.module.css';

export default function Navbar({ openMenu }) {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container_fluid}>
                <div className={`${styles.navbar_left} ${styles.navbar_edge}`}>
                    <button className='icon' onClick={() => openMenu('info')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </button>
                </div>
                <div className={styles.navbar_center}>
                    <img className={styles.logo} src={logo} alt="SpotThePlane logo" />
                </div>
                <div className={`${styles.navbar_right} ${styles.navbar_edge}`}>
                    <button className='icon' onClick={() => openMenu('stats')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
