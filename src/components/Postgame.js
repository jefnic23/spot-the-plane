import React, { useEffect } from "react";
import { render } from '../utils/Helpers';
import { useSelector } from "react-redux";
import { selectDay } from "../store/mainSlice";
import { selectTime } from "../store/timerSlice";
import { selectMiniplanes } from "../store/counterSlice";
import Countdown from "./Countdown";
import Shareable from './Shareable';
import styles from '../styles/Postgame.module.css';
import Container from "./Container";

export default function Postgame({ notify }) {
    const completionTime = useSelector(selectTime);
    const day = useSelector(selectDay);
    const miniplanes = useSelector(selectMiniplanes);

    useEffect(() => {
        let gameState = localStorage.getItem('game_state') ? 
            JSON.parse(localStorage.getItem('game_state')) :  {'completionTime': '', 'answers': [], 'status': 'in_progress', 'rgb': []}
        ;
        let statistics = (localStorage.getItem('statistics') && !JSON.parse(localStorage.getItem('statistics')).avgTimePerQuestion) ?
            JSON.parse(localStorage.getItem('statistics')) : {'daysPlayed': 0, 'totalGameTime': 0, 'avgTime': 0, 'bestTime': null, 'lastPlayed': 'Never'}
        ;
        if (day > statistics.lastPlayed || statistics.lastPlayed === "Never") {
            gameState.completionTime = completionTime;
            gameState.status = 'complete';
            gameState.rgb = miniplanes;
            localStorage.setItem('game_state', JSON.stringify(gameState));
            statistics.daysPlayed += 1;
            statistics.totalGameTime += completionTime;
            statistics.avgTime = statistics.totalGameTime / statistics.daysPlayed;
            statistics.bestTime = (statistics.bestTime == null || completionTime < statistics.bestTime) ? completionTime : statistics.bestTime;
            statistics.lastPlayed = day;
            if (JSON.parse(localStorage.getItem('statistics')).avgTimePerQuestion) {
                localStorage.removeItem('statistics');
            }
            localStorage.setItem('statistics', JSON.stringify(statistics));
        }
    }, [completionTime, miniplanes, day]);

    return (
        <Container animation="animate__fadeIn">
            <div className={styles.time_wrapper}>
                <h1>Completion Time</h1>
                <span className={styles.completion_time}>
                    { render(completionTime) }
                </span>
            </div>
            <div className={styles.results_wrapper}>
                <h1>Answers</h1>
                <div className={styles.miniplane_container}>
                    {miniplanes &&
                        miniplanes.map((miniplane, i) => 
                            <span 
                                key={i} 
                                className="miniplane"
                                style={{backgroundColor: `rgb(${miniplane.r}, ${miniplane.g}, ${miniplane.b})`}} 
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
                    <Shareable notify={notify} />
                </div>
            </div>
        </Container>
    );
}
