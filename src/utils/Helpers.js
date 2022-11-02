import React from 'react';

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

export function getDay(day) {
    let d = day.toString().split('');
    let m = d.slice(4,6);
    let a = d.slice(6);
    let y = d.slice(0,4);
    return <>{m.join('')}/{a.join('')}/{y.join('')}</>;
}

export function getTimeFromMs(t) {
    let mm = parseInt((t / (1000 * 60)) % 60);
    let ss = parseInt((t / 1000) % 60);
    let ms = parseInt((t % 1000) / 10);
    let leadZeroTime = [mm, ss, ms].map(time => time < 10 ? `0${time}` : time);
    return <>{leadZeroTime[0]}:{leadZeroTime[1]}.{leadZeroTime[2]}</>;
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

export function renderCountdown(time) {
    let hh = parseInt((time / (1000 * 60 * 60)) % 60); 
    let mm = parseInt((time / (1000 * 60)) % 60);
    let ss = parseInt((time / 1000) % 60);
    let leadZeroTime = [hh, mm, ss].map(t => t < 10 ? `0${t}` : t);
    return <span>{leadZeroTime[0]}:{leadZeroTime[1]}:{leadZeroTime[2]}</span>;
}
