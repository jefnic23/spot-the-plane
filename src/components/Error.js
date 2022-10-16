import React from 'react';

export default function Error() {
    return (
        <div className={`overlay_content animate__animated animate__fadeIn animate__faster`}>
            <h1 className="text_center">The server is not responding.</h1>
            <p className="text_center">Come back later and try again.</p>
        </div>
    );
}