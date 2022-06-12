import { useState, useEffect } from 'react';
import styles from '../styles/Timer.module.css';

function render(time) {
    let mm = parseInt((time / (1000 * 60)) % 60);
    let ss = parseInt((time / 1000) % 60);
    let ms = parseInt((time % 1000) / 10);
    let leadZeroTime = [mm, ss, ms].map(t => t < 10 ? `0${t}` : t);
    return <>{leadZeroTime[0]}:{leadZeroTime[1]}.{leadZeroTime[2]}</>;
}

export default function Timer({ status, addTime, subTime, animate, unanimate, getTime }) {
    const [time, setTime] = useState(0);
    
    useEffect(() => {
        let interval;
        if (status) {
            let offset = Date.now();
            interval = setInterval(() => {
                let now = Date.now(), d = now - offset;
                offset = now;
                setTime((clock) => addTime ? clock + d + 10000 : clock + d);
                subTime();
            });
        } else {
            getTime(time);
        }
        return () => clearInterval(interval);
    }, [status, addTime, subTime, time, getTime]);

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
