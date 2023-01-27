import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthor, selectQuote } from '../store/quoteSlice';
import styles from '../styles/Quote.module.css';

export default function Quote() {
    const quote = useSelector(selectQuote);
    const author = useSelector(selectAuthor);

    return (
        <div className={styles.container}>
            <blockquote className={styles.blockquote}>
                <p className={styles.quote}>{quote}</p>
                <p className={styles.author}>&mdash; {author}</p>
            </blockquote>
        </div>
    );
}