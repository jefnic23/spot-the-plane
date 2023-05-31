import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthor, selectQuote } from '../store/quoteSlice';
import { getGameState, getStatistics } from '../utils/Storage';
import { setQuote } from '../store/quoteSlice';
import { compDay } from '../utils/Helpers';
import styles from '../styles/Quote.module.css';

export default function Quote() {
    const quote = useSelector(selectQuote);
    const author = useSelector(selectAuthor);
    const dispatch = useDispatch();

    useEffect(() => {
        let gameState = getGameState();
        let statistics = getStatistics();
        
        let today = compDay();

        if (today > statistics.lastPlayed || today > gameState.day) {
            fetch(`/api/quote?seed=${today}`, { method: "GET" })
            .then(res => res.json())
            .then(data => {
                dispatch(setQuote({quote: data.quote, author: data.author}));
            })
            .catch(err => {
                console.log(err);
            });
        }
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <blockquote className={styles.blockquote}>
                <p className={styles.quote}>{quote}</p>
                <p className={styles.author}>&mdash; {author}</p>
            </blockquote>
        </div>
    );
}