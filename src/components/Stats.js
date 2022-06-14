import styles from '../styles/Stats.module.css';

function getTimeFromMs(t) {
    let mm = parseInt((t / (1000 * 60)) % 60);
    let ss = parseInt((t / 1000) % 60);
    let ms = parseInt((t % 1000) / 10);
    let leadZeroTime = [mm, ss, ms].map(time => time < 10 ? `0${time}` : time);
    return <>{leadZeroTime[0]}:{leadZeroTime[1]}.{leadZeroTime[2]}</>;
}

function getDay(da) {
    if (da !== "Never") {
        let d = da.toString().split('');
        let m = d.slice(4,6);
        let a = d.slice(6);
        let y = d.slice(0,4);
        return `${m.join('')}/${a.join('')}/${y.join('')}`;
    } else {
        return da;
    }
}

export default function Stats({ animation, closeMenu, statistics }) {
    return (
        <div className={`share_overlay animate__animated ${animation} animate__faster`}>
            <button className="close icon" onClick={() => closeMenu('stats')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className={styles.stat_container}>
                <h1>Statistics</h1>
                <div className={styles.avg_container}>
                    <div className={styles.avg_item}>
                        <p>Average completion time</p>
                        <span>{ getTimeFromMs(statistics.avgCompletionTime) }</span>
                    </div>
                    <div className={styles.avg_item}>
                        <p>Average question time</p>
                        <span>{ getTimeFromMs(statistics.avgTimePerQuestion) }</span>
                    </div>
                    <div className={styles.avg_item}>
                        <p>Days played</p>
                        <span>{ statistics.daysPlayed }</span>
                    </div>
                    <div className={styles.avg_item}>
                        <p>Last played</p>
                        <span>{ getDay(statistics.lastPlayed) }</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
