import React, { useState, useEffect } from 'react';

function getTomorrow() {
    let tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(0,0,0,0);
    return tmrw.getTime();
}

function render(time) {
    let hh = parseInt((time / (1000 * 60 * 60)) % 60); 
    let mm = parseInt((time / (1000 * 60)) % 60);
    let ss = parseInt((time / 1000) % 60);
    let leadZeroTime = [hh, mm, ss].map(t => t < 10 ? `0${t}` : t);
    return <span>{leadZeroTime[0]}:{leadZeroTime[1]}:{leadZeroTime[2]}</span>;
}

export default function Countdown() {
    const tmrw = getTomorrow();
    const [time, setTime] = useState(tmrw - new Date().getTime());

    useEffect(() => {
        let countdown = setInterval(() => {
            let now = Date.now();
            setTime(tmrw - now);
        });
        return () => clearInterval(countdown);
    });

    return (
        <>
            { render(time) }
        </>
    );
}
