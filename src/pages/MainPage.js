import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from "react-redux";
import { compDay } from '../components/Helpers';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Navbar from "../components/Navbar";
import Game from "../components/game/Game";
import Pregame from '../components/pregame/Pregame';
import Postgame from '../components/Postgame';
import Info from '../components/Info';
import Stats from '../components/Stats';
import { dispatch } from 'react-hot-toast/dist/core/store';

const notify = (msg) => toast(msg);

export default function MainPage() {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [animation, setAnimation] = useState('animate__fadeIn');
    const [menuAnimation, setMenuAnimation] = useState();
    const [info, setInfo] = useState(false);
    const [stats, setStats] = useState(false);
    const [begun, setBegun] = useState(false);
    const [day, setDay] = useState();
    const [data, setData] = useState();
    const [completionTime, setTime] = useState(0);
    const [rgb, setRGB] = useState();
    const gameOver = useSelector((state) => state.game.value);
    const gameStarted = useSelector((state) => state.pregame.value);

    useEffect(() => {
        let gameState = localStorage.getItem('game_state') ? 
            JSON.parse(localStorage.getItem('game_state')) :  {'completionTime': '', 'answers': [], 'status': 'in_progress', 'rgb': []}
        ;
        let statistics = (localStorage.getItem('statistics') && !JSON.parse(localStorage.getItem('statistics')).avgTimePerQuestion) ?
            JSON.parse(localStorage.getItem('statistics')) : {'daysPlayed': 0, 'totalGameTime': 0, 'avgTime': 0, 'bestTime': null, 'lastPlayed': 'Never'}
        ;
        if (!gameState || gameState.status === 'in_progress' || compDay() > statistics.lastPlayed || statistics.lastPlayed === 'Never') {
            fetch("/api/game", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seed: compDay() })
            })
            .then(res => res.json())
            .then(data => {
                setDay(data.day);
                setData(data.data);
                cacheImages(data.images);
            })
            .catch(err => {
                console.log(err);
                setLoaded(true);
                setError(true);
            });                
        } else {
            setDay(statistics.lastPlayed);
            setTime(gameState.completionTime);
            setRGB(gameState.rgb);
            setBegun(true);
            setLoaded(true);
            dispatch(endGame());
        }
        localStorage.setItem('game_state', JSON.stringify(gameState));
        localStorage.setItem('statistics', JSON.stringify(statistics));
    }, []);

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
            <Navbar openMenu={openMenu} />
            {info && <Info animation={menuAnimation} closeMenu={closeMenu} />}
            {stats && <Stats animation={menuAnimation} closeMenu={closeMenu} statistics={JSON.parse(localStorage.getItem('statistics'))} />}
            {loaded ? 
                error ? 
                    <Error />
                :
                    <>
                        {!begun && <Pregame animation={animation} />}
                        {begun && !gameOver && <Game data={data} animation={animation} />}
                        {gameOver && <Postgame completionTime={completionTime} rgb={rgb} day={day} notify={notify} />}
                    </>
            :
                <Loader />
            }
            <Toaster />
        </>
    );
}
