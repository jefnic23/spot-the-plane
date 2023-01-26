import React from 'react';
import Container from './Container';

export default function Error() {
    return (
        <Container animation='animate__fadeIn'>
            <h1 className="text_center">The server is not responding.</h1>
            <p className="text_center">Come back later and try again.</p>
        </Container>
    );
}