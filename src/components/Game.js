import React, { useState } from 'react';
import Timer from "./Timer";
import Counter from './Counter';
import Plane from './Plane';
import AnswerButton from './AnswerButton';
import styles from '../styles/Game.module.css';

function findAnswer(q) {
    return q[0];
}

export default function Game({ data, endGame, animation }) {
    const [status, setStatus] = useState(true);
    const [addTime, setAddTime] = useState(false);
    const [colors, getColors] = useState(false);
    const [minicolors, setMinicolors] = useState([]);
    const [animate, setAnimate] = useState(false);
    const [incCounter, setIncCounter] = useState(false);
    const [stopCount, setStopCount] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [index, setIndex] = useState(0);
    const [compAnimation, setAnimation] = useState(animation);
    const [planeAnimation, setPlaneAnimation] = useState();
    const [buttonAnimation, setButtonAnimation] = useState();
    const answer = data[index].filter(findAnswer)[0];

    const subTime = () => {
        setAddTime(false);
    }

    const unanimate = () => {
        setAnimate(false);
    }

    const decCounter = () => {
        setIncCounter(false);
    }

    const getMiniPlaneColors = (rgb) => {
        setMinicolors(prev => [...prev, rgb]);
        setDisabled(true);
        setStopCount(true);
        if (index === data.length - 1) {
            setStatus(false);
            setTimeout(() => {
                setAnimation('animate__fadeOut');
            }, 1000);
        } else {
            setTimeout(() => {
                setButtonAnimation('animate__flipOutX');
            }, 1000);
            setTimeout(() => {
                setPlaneAnimation('animate__backOutRight');
            }, 1500);
            setTimeout(() => {
                setPlaneAnimation('animate__backInLeft');
                setButtonAnimation('animate__flipInX');
                setIndex(i => i + 1);
                setDisabled(false);
                setStopCount(false);
            }, 2000);
        }
        getColors(false);
    }

    const getTime = (t) => {
        setTimeout(() => {
            endGame(t, minicolors);
        }, 1500);
    }

    const checkAnswer = (e) => {
        let answer = data[index].filter(findAnswer)[0];
        if (e.target.value === answer[1]) {
            getColors(true);
        } else {
            e.target.disabled = true;
            setAddTime(true);
            setIncCounter(true);
            if (!animate) {
                setAnimate(true);
            } else {
                setAnimate(false);
                setTimeout(() => {
                    setAnimate(true);
                }, 10);
            }
        }
    }

    return (
        <div className={`animate__animated ${compAnimation} animate__faster`}>
            <Timer status={status} addTime={addTime} subTime={subTime} animate={animate} unanimate={unanimate} getTime={getTime} />
            <div className={styles.miniplane_container}>
                {data && 
                    data.map((d, i) =>
                        <Counter key={i} id={i} index={index} incCounter={incCounter} decCounter={decCounter} stopCount={stopCount} colors={colors} getMiniPlaneColors={getMiniPlaneColors} />
                    )
                }
            </div>
            {data && <Plane data={answer[2]} animation={planeAnimation} />}
            <div className={styles.answers}>
                {data && 
                    data[index].map((d, i) =>
                        <AnswerButton key={i} id={d[1]} answer={answer} index={index} disabled={disabled} checkAnswer={checkAnswer} animation={buttonAnimation} />
                    )
                }
            </div>
        </div>
    );
}
