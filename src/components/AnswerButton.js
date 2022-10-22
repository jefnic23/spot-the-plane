import React, { useState, useEffect } from "react";
import styles from '../styles/AnswerButton.module.css';

export default function AnswerButton({ id, answer, index, disabled, checkAnswer, animation }) {
    const [status, setStatus] = useState('');

    const checkGuess = (e) => {
        if (e === answer.model) {
            setStatus(styles.correct);
        } else {
            setStatus(styles.wrong);
        }
    }

    useEffect(() => {
        setStatus('');
    }, [index]);

    return (
        <button 
            className={`${styles.answerbutton} animate__animated ${animation} animate__faster ${status}`} 
            key={id} 
            value={id} 
            disabled={disabled} 
            onClick={(e) => {checkAnswer(e); checkGuess(e.target.value)}}
        > 
            {id} 
        </button>
    );
}
