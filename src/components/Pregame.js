import styles from '../styles/Pregame.module.css';

export default function Pregame({ startGame, animation }) {
    return (
        <div className={`overlay_content animate__animated ${animation} animate__faster`}>
            <div className={styles.pregame}>
                <p>See how quickly you can identify ten aircraft.</p>
                <p>When you click <strong>START SPOTTING</strong>, a timer begins.</p>
                <p>Incorrect guesses add <strong>10 seconds</strong> to the timer.</p>
                <p>A new set of planes is available each day. Share your results and see who is the faster spotter!</p>
            </div>
            <hr />
            <button 
                className={styles.start}
                onClick={startGame}
            >
                START SPOTTING
            </button>
        </div>
    );
}
