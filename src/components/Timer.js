import React, { useEffect, useRef } from 'react';
import { render } from '../utils/Helpers';
import { useSelector, useDispatch } from "react-redux";
import { increment, selectTime } from '../store/timerSlice';
import styles from '../styles/Timer.module.css';
import { getGameState, setGameState } from '../utils/Storage';

function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function Timer({ status, addTime, subTime, animate, unanimate, updateCompletionTime, stopCompletionTime }) {
    const time = useSelector(selectTime);
    const dispatch = useDispatch();

    useInterval(() => {
        dispatch(increment(10));
    }, status ? 10 : null);

    useEffect(() => {
        if (addTime) {
            dispatch(increment(10000));
            subTime();
        }
    }, [addTime, subTime, dispatch]);

    useEffect(() => {
        if (updateCompletionTime) {
            let gameState = getGameState();
            gameState.completionTime = time;
            setGameState(gameState);
            stopCompletionTime();
        }
    }, [updateCompletionTime, stopCompletionTime, time])

    return (
        <div className={styles.timer}>
            <span 
                style={{
                    color: animate ? 'red' : '#fff',
                    animation: animate ? `${styles.animate} 1s forwards 1s` : ''
                }}
                onAnimationEnd={() => unanimate()}
            >
                { render(time) }
            </span>
        </div>
    );
}
