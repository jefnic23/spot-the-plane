import React from 'react';
import styles from '../styles/Container.module.css';

export default function Container(props) {
    return (
        <div className={`${styles.container} animate__animated ${props.animation || ""} animate__faster`}>
            { props.children }
        </div>
    );
}
