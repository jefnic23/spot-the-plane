import React, { useState, useEffect } from 'react';
import { getTomorrow, renderCountdown } from '../utils/Helpers';

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
            { renderCountdown(time) }
        </>
    );
}
