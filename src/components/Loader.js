import React from 'react';
import Quote from './Quote';
import styles from '../styles/Loader.module.css';

export default function Loader() {
    const bubbles = () => {
        let items = [];
        for (let i=1; i < 21; i++) {
            items.push(<span key={i} style={{"--i": i}}></span>);
        }
        return items;
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.loader}>
                    <div className={styles.title}>loading</div>
                    {bubbles()}
                    <div className={styles.plane}></div>
                </div>
            </div>
            <Quote />
        </div>
    );
}