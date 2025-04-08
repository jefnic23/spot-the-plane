import React, { useState, useEffect } from 'react';
import styles from '../styles/InstallPrompt.module.css';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            if (navigator.maxTouchPoints < 1) return;

            const dismissed = localStorage.getItem('pwaInstallPromptDismissed');
            if (dismissed === 'true') return;

            e.preventDefault(); // Prevent the default prompt
            setDeferredPrompt(e); // Save the event
            setShowModal(true); // Show the modal
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the native prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                setDeferredPrompt(null); // Clear the deferred prompt
            });
        }
        setShowModal(false); // Close the modal
    };

    const handleCloseModal = () => {
        localStorage.setItem('pwaInstallPromptDismissed', 'true');
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className={`${styles.modal}`}>
                    <div className={`${styles.modalcontent}`}>
                        <h2>Install Spot the Plane</h2>
                        <button className={`${styles.button}`} onClick={handleInstall}>Install</button>
                        <button className={`${styles.button}`} onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};
