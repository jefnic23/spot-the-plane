import React, { useRef } from 'react';
import { getDay, render } from '../utils/Helpers';
import { useSelector, useDispatch } from 'react-redux';
import { selectDay } from '../store/mainSlice';
import { selectTime } from '../store/timerSlice';
import { selectMiniplanes } from '../store/counterSlice';
import { setAnimation, setNoShare, setUrl } from '../store/resultsSlice';
import html2canvas from 'html2canvas';
import endplane from '../assets/endplane.png';
import styles from '../styles/Shareable.module.css';

export default function Shareable ({ notify }) {
    const completionTime = useSelector(selectTime);
    const day = useSelector(selectDay);
    const miniplanes = useSelector(selectMiniplanes);
    const dispatch = useDispatch();
    const ref = useRef();

    const HtmlToImage = (el) => {
        let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        html2canvas(el).then((canvas) => {
            dispatch(setUrl(canvas.toDataURL()));
            canvas.toBlob((blob) => {
                if (navigator.canShare && navigator.userAgentData.mobile) {
                    let f = [new File([blob], 'spottheplane.png', {type: blob.type, lastModified: day})];
                    navigator.share({files: f})
                    .then(() => console.log('Share successful.'))
                    .catch((error) => console.log('Share failed', error));
                } else {
                    if (typeof window.ClipboardItem != 'undefined' && !isSafari) {
                        navigator.clipboard.write(
                            [new window.ClipboardItem({'image/png': blob})]
                        ).then(() => {
                            notify('Results copied to clipboard.');
                        });
                    } else {
                        dispatch(setAnimation('animate__fadeInUpBig'));
                        dispatch(setNoShare(true));
                        notify('Right click/hold to copy.');
                    }
                }
            });
        });
    }

    return (
        <>
            <button className={styles.share_button} onClick={() => HtmlToImage(ref.current)}>
                Share
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </span>
            </button>
            <div ref={ref} className={styles.shareable}>
                <div className={styles.shareable_header}>
                    <div>
                        <p>SPOT THE PLANE {getDay(day)}</p>
                    </div>
                    <div style={{fontSize: '34px'}}>
                        {render(completionTime)}
                    </div>
                </div>
                <div className={styles.miniplane_container}>
                    {miniplanes.map((miniplane, i) => 
                        <img 
                            key={i} 
                            src={endplane}
                            alt="miniplane.png"
                            style={{ backgroundColor: `rgb(${miniplane.r}, ${miniplane.g}, ${miniplane.b})` }} 
                        />
                    )}
                </div>
            </div>
        </>
    );
}
