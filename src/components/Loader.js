import React from 'react';
import Quote from './Quote';
import styles from '../styles/Loader.module.css';
import Container from './Container';

export default function Loader() {
    const bubbles = () => {
        let items = [];
        for (let i=1; i < 21; i++) {
            items.push(<span key={i} style={{"--i": i}}></span>);
        }
        return items;
    }

    return (
        <Container animation='animate__zoomIn'>
            <div className={styles.wrapper}>
                <div className={styles.loader}>
                    <div className={styles.title}>loading</div>
                    {bubbles()}
                    <div className={styles.plane}></div>
                </div>
            </div>
            <Quote />
        </Container>
    );
}