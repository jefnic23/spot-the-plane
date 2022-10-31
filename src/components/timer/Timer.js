import React, { useEffect, useRef } from 'react';
import { render } from '../Helpers';
import { useSelector, useDispatch } from "react-redux";
import { increment } from './timerSlice';
import styles from './Timer.module.css';

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
    const time = useSelector((state) => state.timer.value);
    const dispatch = useDispatch();

    useInterval(() => {
        dispatch(increment(10));
    }, status ? 10 : null);

    useEffect(() => {
        if (addTime) {
            dispatch(increment(10000));
            subTime();
        }
    }, [addTime, subTime]);

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
