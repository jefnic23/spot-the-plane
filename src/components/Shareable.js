import html2canvas from 'html2canvas';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import endplane from '../assets/endplane.png';
import { selectMiniplanes } from '../store/counterSlice';
import { selectDay } from '../store/mainSlice';
import { setAnimation, setNoShare, setUrl } from '../store/resultsSlice';
import { selectTime } from '../store/timerSlice';
import styles from '../styles/Shareable.module.css';
import { getDay, render } from '../utils/Helpers';

export default function Shareable ({ notify }) {
    const completionTime = useSelector(selectTime);
    const day = useSelector(selectDay);
    const miniplanes = useSelector(selectMiniplanes);
    const dispatch = useDispatch();
    const ref = useRef();

    // regex patterns for determing how shareable image is created/displayed
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const HtmlToImage = async (el) => {
        let canvas = await html2canvas(el, { imageTimeout: 0, scale: 1 });
        dispatch(setUrl(canvas.toDataURL()));
        canvas.toBlob((blob) => {
            if (navigator.canShare && isMobile) {
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
    }

    return (
        <>
            <button className={styles.share_button} onClick={() => HtmlToImage(ref.current)}>
                Share
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </span>
            </button>
            <div 
                ref={ref} 
                style={{
                    position: 'fixed',
                    top: '-1000%',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#121213',
                    color: '#fff',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        width: '100%',
                        textAlign: 'center'
                    }}
                >
                    <div style={{width: '45%'}}>
                        <p style={{ margin: '0', fontSize: '13px' }}>SPOT THE PLANE {getDay(day)}</p>
                    </div>
                    <div style={{ fontSize: '34px', width: '55%' }}>
                        {render(completionTime)}
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    {miniplanes.map((miniplane, i) => 
                        <img 
                            key={i} 
                            src={endplane}
                            alt="miniplane.png"
                            style={{ 
                                backgroundColor: `rgb(${miniplane.r}, ${miniplane.g}, ${miniplane.b})`,
                                width: '24px',
                                height: '24px',
                                margin: i === 0 ? '0 2px 0 0' : i === 9 ? '0 0 0 2px' : '0 2px'
                            }} 
                        />
                    )}
                </div>
            </div>
        </>
    );
}
