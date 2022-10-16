import { useState } from 'react';
import Results from './Results';
import html2canvas from 'html2canvas';
import endplane from '../endplane.png';
import styles from '../styles/CreateShareable.module.css';

function getDay(day) {
    let d = day.toString().split('');
    let m = d.slice(4,6);
    let a = d.slice(6);
    let y = d.slice(0,4);
    return <>{m.join('')}/{a.join('')}/{y.join('')}</>;
}

export default function CreateShareable ({ completionTime, rgb, day, notify }) {
    const [noShare, setNoShare] = useState();
    const [url, setUrl] = useState();
    const [animation, setAnimation] = useState();

    const HtmlToImage = () => {
        let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        let el = document.getElementsByClassName(styles.shareable)[0];
        html2canvas(el).then((canvas) => {
            setUrl(canvas.toDataURL());
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
                        setAnimation('animate__fadeInUpBig');
                        setNoShare(true);
                        notify('Right click/hold to copy.');
                    }
                }
                setAnimation('animate__fadeInUpBig');
                setNoShare(true);
                notify('Right click/hold to copy.');
            });
        });
    }

    const closeResults = () => {
        setAnimation('animate__fadeOutDownBig');
        setTimeout(() => {
            setNoShare(false);
        }, 500)
    }

    return (
        <>
            <button className={styles.share_button} onClick={HtmlToImage}>
                Share
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                </span>
            </button>
            <div className={styles.shareable}>
                <div className={styles.shareable_header}>
                    <div>
                        <p>SPOT THE PLANE {getDay(day)}</p>
                    </div>
                    <div style={{fontSize: '34px'}}>
                        {completionTime}
                    </div>
                </div>
                <div className={styles.miniplane_container}>
                    {rgb.map((c, i) => 
                        <img 
                            key={i} 
                            src={endplane}
                            alt="miniplane.png"
                            style={{
                                backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`,
                                width: '24px',
                                height: '24px',
                            }} 
                        />
                    )}
                </div>
            </div>
            {noShare && <Results url={url} closeResults={closeResults} animation={animation} />}
        </>
    );
}
