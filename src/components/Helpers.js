export function compDay() {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    return parseInt(`${yyyy}${mm}${dd}`);
}

export function findAnswer(q) {
    return q.answer;
}

export function getTomorrow() {
    let tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(0,0,0,0);
    return tmrw.getTime();
}

export function render(time) {
    let mm = parseInt((time / (1000 * 60)) % 60);
    let ss = parseInt((time / 1000) % 60);
    let ms = parseInt((time % 1000) / 10);
    let leadZeroTime = [mm, ss, ms].map(t => t < 10 ? `0${t}` : t);
    return <>{leadZeroTime[0]}:{leadZeroTime[1]}.{leadZeroTime[2]}</>;
}
