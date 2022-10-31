import React, { useEffect, useRef } from 'react';
import { render } from '../utils/Helpers';
import { useSelector, useDispatch } from "react-redux";
import { increment, selectTime } from '../store/timerSlice';
import styles from '../styles/Timer.module.css';

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

export default function Timer({ status, addTime, subTime, animate, unanimate }) {
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
