import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import Error from "./components/Error";
import Game from "./components/Game";
import Info from './components/Info';
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Postgame from './components/Postgame';
import Pregame from './components/Pregame';
import Results from './components/Results';
import Stats from './components/Stats';
import InstallPrompt from './components/InstallPrompt';
import './index.css';
import { setMiniplanes } from './store/counterSlice';
import { endGame, selectGameOver, setIndex } from './store/gameSlice';
import { setDay } from './store/mainSlice';
import { selectGameStarted } from './store/pregameSlice';
import { selectNoShare } from './store/resultsSlice';
import { increment } from './store/timerSlice';
import { compDay } from './utils/Helpers';
import { getGameState, getStatistics, resetGameState, setGameState, setStatistics } from './utils/Storage';

const notify = (msg) => toast(msg, {
    style: {
        border: '1px solid #fff',
        padding: '13px',
        color: '#fff',
        background: '#333'
    }
});

export default function App() {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [animation, setAnimation] = useState('animate__fadeIn');
    const [menuAnimation, setMenuAnimation] = useState();
    const [resumed, setResumed] = useState(false);
    const [info, setInfo] = useState(false);
    const [stats, setStats] = useState(false);
    const [begun, setBegun] = useState(false);
    const [data, setData] = useState();

    const gameStarted = useSelector(selectGameStarted);
    const gameOver = useSelector(selectGameOver);
    const noShare = useSelector(selectNoShare);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGame = (seed, gameState, statistics) => {
            fetch(`/api/game?seed=${seed}`, { method: "GET" })
                .then(res => res.json())
                .then(data => {
                    // update game state
                    gameState = resetGameState(data.data, data.images, seed);
                    // statistics.lastPlayed = today;
                    setGameState(gameState);
                    setStatistics(statistics);

                    dispatch(setDay(data.day));
                    setData(data.data);
                    cacheImages(data.images);
                })
                .catch(err => {
                    console.log(err);
                    setError(true);
                    setLoaded(true);
                });
        }

        let gameState = getGameState();
        let statistics = getStatistics();

        let today = compDay();
        let status = gameState.status;

        if (status === 'in_progress' && today === gameState.day) {
            // resume game
            dispatch(setDay(today));
            dispatch(setIndex(gameState.rgb.length));
            dispatch(setMiniplanes(gameState.rgb));
            dispatch(increment(gameState.completionTime));
            setData(gameState.data);
            setResumed(true);
            cacheImages(gameState.images);
        }

        if ((today > statistics.lastPlayed || today > gameState.day) && (status === 'not_started' || status === 'complete' || (status === 'in_progress' && today !== gameState.day))) {
            fetchGame(today, gameState, statistics);
        }

        if (status === 'complete' && today === statistics.lastPlayed) {
            dispatch(setDay(statistics.lastPlayed));
            dispatch(increment(gameState.completionTime));
            dispatch(setMiniplanes(gameState.rgb));
            setBegun(true);
            setLoaded(true);
            dispatch(endGame());
        }
    }, [dispatch]);

    useEffect(() => {
        if (gameStarted) {
            setAnimation('animate__fadeOut');
            setTimeout(() => {
                setAnimation('animate__fadeIn');
                setBegun(true);
            }, 500);
        }
    }, [gameStarted]);

    const cacheImages = async (imgs) => {
        const promises = await imgs.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;

                img.onload = resolve();
                img.onerror = reject();
            });
        });
        await Promise.all(promises);
        setLoaded(true);
    }

    const openMenu = (m) => {
        setMenuAnimation('animate__fadeInUpBig');
        // eslint-disable-next-line
        switch (m) {
            case 'info':
                setInfo(true);
                break;
            case 'stats':
                setStats(true);
                break;
        }
    }

    const closeMenu = (m) => {
        setMenuAnimation('animate__fadeOutDownBig');
        setTimeout(() => {
            // eslint-disable-next-line
            switch (m) {
                case 'info':
                    setInfo(false);
                    break;
                case 'stats':
                    setStats(false);
                    break;
            }
        }, 500);
    }

    return (
        <>
            <Toaster />
            <InstallPrompt />
            <Navbar openMenu={openMenu} />
            {info && <Info animation={menuAnimation} closeMenu={closeMenu} />}
            {stats && <Stats animation={menuAnimation} closeMenu={closeMenu} statistics={getStatistics()} />}
            {noShare && <Results />}
            {loaded ?
                error ?
                    <Error />
                    :
                    <>
                        {!begun && <Pregame animation={animation} resumed={resumed} />}
                        {begun && !gameOver && <Game data={data} animation={animation} resumed={resumed} />}
                        {gameOver && <Postgame notify={notify} />}
                    </>
                :
                <Loader />
            }
        </>
    );
}
