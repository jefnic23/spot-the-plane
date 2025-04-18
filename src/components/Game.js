import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { endGame, incrementIndex, selectIndex } from '../store/gameSlice';
import { findAnswer } from '../utils/Helpers';
import Timer from "./Timer";
import Counter from './Counter';
import Plane from './Plane';
import AnswerButton from './AnswerButton';
import Container from './Container';
import styles from '../styles/Game.module.css'; 
import { getGameState, setGameState } from '../utils/Storage';

export default function Game({ data, animation, resumed }) {
    const [status, setStatus] = useState(true);
    const [addTime, setAddTime] = useState(false);
    const [updateCompletionTime, setCompletionTime] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [incCounter, setIncCounter] = useState(false);
    const [stopCount, setStopCount] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [compAnimation, setAnimation] = useState(animation);
    const [planeAnimation, setPlaneAnimation] = useState();
    const [buttonAnimation, setButtonAnimation] = useState();
    const index = useSelector(selectIndex);
    const dispatch = useDispatch();

    const subTime = () => {
        setAddTime(false);
    }

    const unanimate = () => {
        setAnimate(false);
    }

    const decCounter = () => {
        setIncCounter(false);
    }

    const stopCompletionTime = () => {
        setCompletionTime(false);
    }

    const getAnswer = (data, index) => {
        return data[index].filter(findAnswer)[0];
    }

    const nextQuestion = () => {
        setDisabled(true);
        setStopCount(true);
        setCompletionTime(true);
        if (index === data.length - 1) {
            setStatus(false);
            setTimeout(() => {
                setAnimation('animate__fadeOut');
            }, 1000);
            setTimeout(() => {
                let gameState = getGameState();
                gameState.status = "complete";
                setGameState(gameState);
                dispatch(endGame());
            }, 1500);
        } else {
            setTimeout(() => {
                setButtonAnimation('animate__flipOutX');
            }, 1250);
            setTimeout(() => {
                setPlaneAnimation('animate__zoomOut');
            }, 1500);
            setTimeout(() => {
                setPlaneAnimation('animate__zoomIn');
                setButtonAnimation('animate__flipInX');
                dispatch(incrementIndex());
                setDisabled(false);
                setStopCount(false);
            }, 2000);
        }
        setAnswered(false);
    }

    const checkAnswer = (e) => {
        let answer = getAnswer(data, index);
        if (e.target.value === answer.model) {
            setAnswered(true);
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
        <Container animation={compAnimation}>
            <div className={styles.timer_wrapper}>
                <Timer status={status} addTime={addTime} subTime={subTime} animate={animate} unanimate={unanimate} updateCompletionTime={updateCompletionTime} stopCompletionTime={stopCompletionTime} />
                <div className={styles.miniplane_container}>
                    {data && 
                        data.map((_, i) =>
                            <Counter key={i} id={i} index={index} incCounter={incCounter} decCounter={decCounter} stopCount={stopCount} answered={answered} nextQuestion={nextQuestion} resumed={resumed} />
                        )
                    }
                </div>
            </div>
            <div className={styles.plane_wrapper}>
                {data && <Plane data={getAnswer(data, index).details} animation={planeAnimation} />}
                <div className={styles.answers}>
                    {data && 
                        data[index].map((d, i) =>
                            <AnswerButton key={i} id={d.model} answer={getAnswer(data, index)} index={index} disabled={disabled} checkAnswer={checkAnswer} animation={buttonAnimation} />
                        )
                    }
                </div>
            </div>
        </Container>
    );
}
