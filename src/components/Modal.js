import React from 'react';
import styles from '../styles/Modal.module.css'

export default function Modal({ props }) {
    return (
        <div className={styles.overlay}>
            {props.children}
        </div>
    );
}