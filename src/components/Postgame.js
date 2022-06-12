import { useEffect } from "react";
import Countdown from "./Countdown";
import CreateShareable from './CreateShareable';
import styles from '../styles/Postgame.module.css';

function getTimeFromMs(t) {
    let mm = parseInt((t / (1000 * 60)) % 60);
    let ss = parseInt((t / 1000) % 60);
    let ms = parseInt((t % 1000) / 10);
    let leadZeroTime = [mm, ss, ms].map(time => time < 10 ? `0${time}` : time);
    return <>{leadZeroTime[0]}:{leadZeroTime[1]}.{leadZeroTime[2]}</>;
}

export default function Postgame({ completionTime, rgb, day, notify }) {
    useEffect(() => {
        let gameState = localStorage.getItem('game_state') ? 
            JSON.parse(localStorage.getItem('game_state')) : 
            {'completionTime': '', 'answers': [], 'status': 'in_progress', 'rgb': []}
        ;
        let statistics = localStorage.getItem('statistics') ?
            JSON.parse(localStorage.getItem('statistics')) :
            {'daysPlayed': 0, 'totalGameTime': 0, 'avgCompletionTime': 0, 'avgTimePerQuestion': 0, 'lastPlayed': 'Never'}
        ;
        if (day > statistics.lastPlayed || statistics.lastPlayed === "Never") {
            gameState.completionTime = completionTime;
            gameState.status = 'complete';
            gameState.rgb = rgb;
            localStorage.setItem('game_state', JSON.stringify(gameState));
            statistics.daysPlayed += 1;
            statistics.totalGameTime += completionTime;
            statistics.avgCompletionTime = statistics.totalGameTime / statistics.daysPlayed;
            statistics.avgTimePerQuestion = statistics.avgCompletionTime / 10;
            statistics.lastPlayed = day;
            localStorage.setItem('statistics', JSON.stringify(statistics));
        }
    }, [completionTime, rgb, day]);

    return (
        <div className="overlay_content animate__animated animate__fadeIn">
            <div className="overlay_container">
                <h1>Completion Time</h1>
                <span className={styles.completion_time}>
                    { getTimeFromMs(completionTime) }
                </span>
            </div>
            <div className="overlay_container">
                <h1>Answers</h1>
                <div className={styles.miniplane_container}>
                    {rgb &&
                        rgb.map((c, i) => 
                            <span 
                                key={i} 
                                className="miniplane"
                                style={{backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`}} 
                            ></span>
                        )
                    }
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.countdown}>
                    <h1>Next Planes</h1>
                    <Countdown />
                </div>
                <div className={styles.share}>
                    <CreateShareable completionTime={getTimeFromMs(completionTime)} rgb={rgb} day={day} notify={notify} />
                </div>
            </div>
        </div>
    );
}
