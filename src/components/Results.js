import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { selectAnimation, setAnimation, setNoShare, selectUrl } from '../store/resultsSlice';
import styles from '../styles/Results.module.css';

export default function Results() {
    const animation = useSelector(selectAnimation);
    const url = useSelector(selectUrl);
    const dispatch = useDispatch();

    const closeResults = () => {
        dispatch(setAnimation('animate__fadeOutDownBig'));
        setTimeout(() => {
            dispatch(setNoShare(false));
        }, 500)
    }

    return (
        <div className={`share_overlay animate__animated ${animation} animate__faster`}>
            <button className="close icon" onClick={closeResults}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img
                className={styles.results_image}
                src={url}
                alt="spottheplane.png"
            />
        </div>
    );
}
