import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Timer.module.css';

function render(time) {
    let mm = parseInt((time / (1000 * 60)) % 60);
    let ss = parseInt((time / 1000) % 60);
    let ms = parseInt((time % 1000) / 10);
    let leadZeroTime = [mm, ss, ms].map(t => t < 10 ? `0${t}` : t);
    return <>{leadZeroTime[0]}:{leadZeroTime[1]}.{leadZeroTime[2]}</>;
}

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

export default function Timer({ status, addTime, subTime, animate, unanimate, getTime }) {
    const [time, setTime] = useState(0);

    useInterval(() => {
        setTime(time + 10);
    }, status ? 10 : null);

    useEffect(() => {
        if (addTime) {
            setTime(clock => clock + 10000);
            subTime();
        }
    }, [addTime, subTime]);

    useEffect(() => {
        if (!status) {
            getTime(time);
        }
    }, [status, getTime, time]);

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
