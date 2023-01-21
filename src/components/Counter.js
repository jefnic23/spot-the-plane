import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMiniplanes, updateMiniplanes } from '../store/counterSlice';
import { getGameState, setGameState } from "../utils/Storage";

export default function Counter({ id, index, incCounter, decCounter, stopCount, answered, nextQuestion, resumed }) {
    const [used, setUsed] = useState(false);
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(255);
    const [blue, setBlue] = useState(255);
    const [opacity, setOpacity] = useState(0.21);
    const miniplanes = useSelector(selectMiniplanes);
    const dispatch = useDispatch();

    useEffect(() => {
        if (id === index) {
            let interval;
            if (!stopCount) {
                setUsed(true);
                setBlue(0);
                setOpacity(1);
                interval = setInterval(() => {
                    if (red >= 255) {
                        clearInterval(interval);
                    } else {
                        setGreen((g) => incCounter ? g - 75 : g - 1);
                        setRed((r) => incCounter ? r + 75 : r + 1);
                        decCounter();
                    }
                }, 100);
            }
            if (answered) {
                let gameState = getGameState();
                gameState.rgb.push({r: red, g: green, b: blue});
                setGameState(gameState);
                dispatch(updateMiniplanes({r: red, g: green, b: blue}));
                nextQuestion();
            }
            return () => clearInterval(interval);
        } 
    }, [id, index, red, green, blue, incCounter, decCounter, stopCount, answered, nextQuestion, dispatch]);

    useEffect(() => {
        if (resumed && id < index) {
            console.log(miniplanes[id]);
            setUsed(true);
            setBlue(0);
            setOpacity(1);
            setRed(miniplanes[id].r);
            setGreen(miniplanes[id].g);
        }
    }, [resumed, id, index, miniplanes]);

    return (
        <span 
            className='miniplane'
            style={{backgroundColor: `rgba(${used ? red : 255}, ${green}, ${blue}, ${opacity})`}} 
        ></span>
    );
}
