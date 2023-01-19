import React, { useEffect, useState } from 'react';
import styles from '../styles/Quote.module.css';
import { compDay } from '../utils/Helpers';

export default function Quote() {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    
    useEffect(() => {
        fetch(`/api/quote?seed=${compDay()}`, { method: "GET" })
        .then(res => res.json())
        .then(data => {
            setQuote(data.quote);
            setAuthor(data.author);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <div className={styles.container}>
            <blockquote className={styles.blockquote}>
                <p className={styles.quote}>{quote}</p>
                <p className={styles.author}>&mdash; {author}</p>
            </blockquote>
        </div>
    );
}