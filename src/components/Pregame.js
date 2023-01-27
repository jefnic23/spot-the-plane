import React from 'react';
import { useDispatch } from "react-redux";
import { startGame } from '../store/pregameSlice';
import styles from '../styles/Pregame.module.css';
import Container from './Container';

export default function Pregame({ animation, resumed }) {
    const dispatch = useDispatch();

    return (
        <Container animation={animation}>
            <div className={styles.pregame}>
                {resumed ? 
                    <>
                        <p>Looks like you didn't finish today's game.</p>
                        <p>Press <strong>RESUME</strong> to pick up where you left off.</p>
                    </>
                :
                    <>
                        <p>See how quickly you can identify ten aircraft.</p>
                        <p>Press <strong>BEGIN</strong> to start the timer.</p>
                        <p>Incorrect guesses add <strong>10 seconds</strong> to the timer.</p>
                        <p>A new set of planes is available each day. Share your results and see who is the faster spotter!</p>
                    </>
                }
                
            </div>
            <div className={styles.wrapper}>
                <button 
                    className={styles.start}
                    onClick={() => dispatch(startGame())}
                >
                    {resumed ? <>RESUME</> : <>BEGIN</>}
                </button>
            </div>
        </Container>
    );
}
