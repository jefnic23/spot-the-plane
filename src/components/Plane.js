import React from 'react';
import styles from '../styles/Plane.module.css';

export default function Plane({ data, animation }) {
    return (
        <div className={`${styles.img_container} animate__animated ${animation} animate__faster`}>
            <a className={styles.link} href={ data.link } target="_blank" rel="noopener noreferrer">
                <img className={styles.image} src={ data.pic } alt="plane.jpg"  />
                { data.copyright }
            </a>
        </div>
    );
}
