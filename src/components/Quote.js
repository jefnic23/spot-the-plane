import React, { useEffect, useState } from 'react';
import styles from '../styles/Quote.module.css';

export default function Quote() {
    const [quote, setQuote] = useState();
    const [author, setAuthor] = useState();

    useEffect(() => {
        fetch("/api/quote", {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => { 
            setQuote(data.quote);
            setAuthor(data.author);
        });
    }, [])
    
    return (
        <div className={styles.container}>
            <blockquote className={`${styles.blockquote} animate__animated animate__zoomIn animate__faster`}>
                <p className={styles.quote}>{quote}</p>
                <p className={styles.author}>&mdash; {author}</p>
            </blockquote>
        </div>
    );
}