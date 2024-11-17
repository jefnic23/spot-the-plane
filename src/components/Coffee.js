import React, { useState, useEffect } from 'react';

export default function Coffee() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the visibility change when the component mounts
        const timeout = setTimeout(() => {
            setIsVisible(true);
        }, 100); // Delay to ensure smooth animation
        return () => clearTimeout(timeout);
    }, []);

    return (
        <a
            href="https://www.buymeacoffee.com/jefnic23"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                margin: 'auto',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                display: 'inline-block',
            }}
        >
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=jefnic23&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" alt="https://www.buymeacoffee.com/jefnic23" />
        </a>
    );
}
