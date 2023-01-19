import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from "react-redux";
import { endGame, selectGameOver } from './store/gameSlice';
import { setDay } from './store/mainSlice';
import { increment } from './store/timerSlice';
import { setMiniplanes } from './store/counterSlice';
import { selectGameStarted } from './store/pregameSlice';
import { selectNoShare } from './store/resultsSlice';
import { compDay } from './utils/Helpers';
import { getGameState, getStatistics, setGameState, setStatistics } from './utils/Storage';
import Loader from "./components/Loader";
import Error from "./components/Error";
import Navbar from "./components/Navbar";
import Game from "./components/Game";
import Pregame from './components/Pregame';
import Postgame from './components/Postgame';
import Info from './components/Info';
import Stats from './components/Stats';
import Results from './components/Results';
import './index.css';

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
    const [info, setInfo] = useState(false);
    const [stats, setStats] = useState(false);
    const [begun, setBegun] = useState(false);
    const [data, setData] = useState();

    const gameStarted = useSelector(selectGameStarted);
    const gameOver = useSelector(selectGameOver);
    const noShare = useSelector(selectNoShare);
    const dispatch = useDispatch();

    useEffect(() => {
        let gameState = getGameState();
        let statistics = getStatistics();
        if (!gameState || gameState.status === 'not_started' || compDay() > statistics.lastPlayed || statistics.lastPlayed === 'Never') {
            fetch(`/api/game?seed=${compDay()}`, { method: "GET" })
            .then(res => res.json())
            .then(data => {
                // update game state
                gameState.status = 'in_progress';
                gameState.data = data.data;
                gameState.images = data.images;

                dispatch(setDay(data.day));
                setData(data.data);
                cacheImages(data.images);
            })
            .catch(err => {
                console.log(err);
                setError(true);
                setLoaded(true);
            });                
        } else if (gameState.status === 'in_progress') {
            cacheImages(gameState.images);
            setBegun(true);
            setLoaded(true);
        } else {
            dispatch(setDay(statistics.lastPlayed));
            dispatch(increment(gameState.completionTime));
            dispatch(setMiniplanes(gameState.rgb));
            setBegun(true);
            setLoaded(true);
            dispatch(endGame());
        }
        setGameState(gameState);
        setStatistics(statistics);
    }, [dispatch]);

    useEffect(() => {
        if (gameStarted){
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
        switch(m) {
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
            switch(m) {
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
            <Navbar openMenu={openMenu} />
            {info && <Info animation={menuAnimation} closeMenu={closeMenu} />}
            {stats && <Stats animation={menuAnimation} closeMenu={closeMenu} statistics={getStatistics()} />}
            {noShare && <Results />}
            {loaded ? 
                error ? 
                    <Error />
                :
                    <>
                        {!begun && <Pregame animation={animation} />}
                        {begun && !gameOver && <Game data={data} animation={animation} />}
                        {gameOver && <Postgame notify={notify} />}
                    </>
            :
                <Loader />
            }
        </>
    );
}
