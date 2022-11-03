import React from 'react';
import Coffee from './Coffee';
import styles from '../styles/Info.module.css';

export default function Info({ animation, closeMenu }) {
    return (
        <div className={`share_overlay animate__animated ${animation} animate__faster`}>
            <button className="close icon" onClick={() => closeMenu('info')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className={styles.info_container}>
                <div className={styles.info_item}>
                    <h1>Contact</h1>
                    <a href="mailto:jefnic23@gmail.com" target="_blank" rel="noopener noreferrer">Email</a>
                </div>
                <div className={styles.info_item}>
                    <h1>Photos</h1>
                    <a href="https://www.planespotters.net/" target="_blank" rel="noopener noreferrer">Planespotters.net</a>
                </div>
                <div className={styles.info_item}>
                    <Coffee />
                </div>
            </div>
            <div className={styles.footnote}>&copy; 2022 Jeff Nicholas</div>
        </div>
    );
}
