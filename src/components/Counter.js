import React, { useState, useEffect } from "react";

export default function Counter({ id, index, incCounter, decCounter, stopCount, colors, getMiniPlaneColors }) {
    const [used, setUsed] = useState(false);
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(255);
    const [blue, setBlue] = useState(255);
    const [opacity, setOpacity] = useState(0.21);

    useEffect(() => {
        if (id === index) {
            let interval;
            if (!stopCount) {
                setUsed(true);
                setBlue(0);
                setOpacity(1);
                interval = setInterval(() => {
                    if (red === 255 ) {
                        clearInterval(interval);
                    } else {
                        setGreen((g) => incCounter ? g - 75 : g - 1);
                        setRed((r) => incCounter ? r + 75 : r + 1);
                        decCounter();
                    }
                }, 100);
            }
            if (colors) {
                getMiniPlaneColors({r: red, g: green, b: blue});
            }
            return () => clearInterval(interval);
        } 
    }, [id, index, red, green, blue, incCounter, decCounter, stopCount, colors, getMiniPlaneColors]);

    return (
        <span 
            className='miniplane'
            style={{backgroundColor: `rgba(${used ? red : 255}, ${green}, ${blue}, ${opacity})`}} 
        ></span>
    );
}
