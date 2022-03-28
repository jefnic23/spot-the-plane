var game_state = localStorage.getItem('game_state'), statistics = localStorage.getItem('statistics');
var counter = document.getElementById('counter').children, 
    c = document.getElementById('answers').children, 
    timer_ele = document.getElementById('timer'), 
    pregame = document.getElementById('pregame'), 
    start = document.getElementById('start'),
    game = document.getElementById('game'),
    postgame = document.getElementById('postgame'),
    completion_time = document.getElementById('completion-time'),
    answer_times = document.getElementById('answer-times'),
    stats = document.getElementById('stats'),
    settings = document.getElementById('settings'),
    results = document.getElementById('results'),
    toast = document.getElementById('toast')
;
var idx = 0, 
    is_running = false, 
    green = 255, 
    red = 0, 
    current_question, 
    answers, 
    pic, 
    size,
    link, 
    copyright
; 

if (statistics) {
    statistics = JSON.parse(statistics);
} else {
    statistics = {'daysPlayed': 0, 'totalGameTime': 0, 'avgCompletionTime': '', 'avgTimePerQuestion': '', 'lastPlayed': ''};
}

if (!game_state || compDay() > statistics.lastPlayed) { 
    game_state = {'completionTime': '', 'answers': [], 'status': 'in_progress'};
    pregame.style.display = 'flex';
    pregame.children[0].classList.add('animate__fadeInDown');
    main_timer = new Timer(timer_ele);
    start.onclick = () => {
        pregame.style.display = 'none';
        initRound();
        callApi(first=true);
        main_timer.start();
        is_running = true;
        trackCounter(first=true); 
        game.classList.remove('overlay');
    }
} else {
    game_state = JSON.parse(game_state);
    if (game_state.status === 'complete') {
        getAnswerTimes();
        completion_time.innerHTML = getTimeFromMs(game_state.completionTime);
        game.style.display = 'none';
        setTimeout(() => {
            postgame.style.display = 'flex';
            postgame.children[0].classList.add('animate__fadeInDown');
        }, 1000);
    } else {
        pregame.style.display = 'flex';
        setTimeout(() => {
            pregame.children[0].classList.add('animate__fadeInDown');
        }, 500);
    }
}

// functions

function compDay() {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let dd = String(today.getDate()).padStart(2, '0');
    return parseInt(`${yyyy}${mm}${dd}`);
}

function initRound() {
    current_question = data[idx].filter(findAnswer)[0];
    answers = {'a1': data[idx][0], 'a2': data[idx][1], 'a3': data[idx][2], 'a4': data[idx][3]};
}

function callApi(first=false) {
    var url = 'https://api.planespotters.net/pub/photos/reg/' + current_question[0];
    fetch(url).then(response => response.json()).then(d => {
        pic = d.photos[0].thumbnail_large.src;
        size = d.photos[0].thumbnail_large.size;
        link = d.photos[0].link;
        copyright = '\u00a9 ' + d.photos[0].photographer;
        if (first) {
            populateQuestions();
        }
    });
}

function populateQuestions() {
    if (document.getElementById('image').nextSibling) {
        document.getElementById('image').nextSibling.remove();
    }
    document.getElementById('image').src = pic;
    // document.getElementById('image').style.width = `${size.width}px`;
    // document.getElementById('image').style.height = `${size.height}px`;
    document.getElementById('link').href = link;
    document.getElementById('link').insertAdjacentText("beforeend", copyright);
    document.getElementById('answer-1').innerHTML = answers.a1[1];
    document.getElementById('answer-2').innerHTML = answers.a2[1];
    document.getElementById('answer-3').innerHTML = answers.a3[1];
    document.getElementById('answer-4').innerHTML = answers.a4[1];
    document.getElementById('answer-1').setAttribute("value", answers.a1[1]);
    document.getElementById('answer-2').setAttribute("value", answers.a2[1]);
    document.getElementById('answer-3').setAttribute("value", answers.a3[1]);
    document.getElementById('answer-4').setAttribute("value", answers.a4[1]);
}

function findAnswer(q) {
    return q[0];
}

function disableButtons() {
    for (var i=0; i < c.length; i++) {
        c[i].disabled = true;
    }
}

function shrinkButtons() {
    let i = 0;
    setTimeout(() => {
        var shrink = setInterval(() => {
            if (i === 4) {
                clearInterval(shrink);
            } else {
                c[i].classList.add('animate__fadeOutRight');
                i++;
            }
        }, 200);
    }, 200);
}

function resetButtons() {
    timer_ele.classList.remove('red-timer');
    for (var i=0; i < c.length; i++) {
        c[i].disabled = false;
        c[i].style.backgroundColor = "";
        c[i].classList.remove('animate__fadeOutRight');
    }
}

function addClass(el, _class) {
    if (el.classList.contains(_class)) {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = null;
    } else {
        el.classList.add(_class);
    }
}

function trackCounter(first=false) {
    if (!first) {
        is_running = true;
    }
    counter[idx].style.opacity = '100%';
    counter[idx].style.backgroundColor = `rgb(${red},${green},0)`;
    tracker();
}

function tracker() {
    let t = setInterval(() => {
        if (red == 255 || !is_running) {
            clearInterval(t);
        } else {
            green -= 1;
            red += 1;
            counter[idx].style.backgroundColor = `rgb(${red},${green},0)`;
        }
    }, 100);
}

function incTracker() {
    return green -= 75, red += 75;
}

function resetColors() {
    return green = 255, red = 0;
}

function getAnswerTimes() {
    for (let i = 0; i < answer_times.children.length; i++) {
        answer_times.children[i].style.opacity = '100%';
        answer_times.children[i].style.backgroundColor = game_state.answers[i];
    }
}

function getTimeInMs(t) {
    let mm = parseInt(t.split(":")[0]);
    let ss = parseInt(t.split(":")[1]);
    let ms = parseInt(t.split(".")[1]);
    return mm * 60000 + ss * 1000 + ms * 10;
}

function getTimeFromMs(t) {
    var ms = parseInt((t%1000)/10);
    var ss = parseInt((t/1000)%60);
    var mm = parseInt((t/(1000*60))%60);
    var leadZeroTime = [mm, ss, ms].map(time => time < 10 ? `0${time}` : time);
    return `${leadZeroTime[0]}:${leadZeroTime[1]}.${leadZeroTime[2]}`;
}

function getDay() {
    let d = day.toString().split('');
    let m = d.slice(4,6);
    let a = d.slice(6);
    let y = d.slice(0,4);
    return `${m.join('')}/${a.join('')}/${y.join('')}`;
}

function closeResults() {
    results.classList.remove('animate__fadeInUpBig');
    results.classList.add('animate__fadeOutDownBig');
    setTimeout(() => {
        results.removeChild(results.children[1]);
    }, 500);
}

function createShareable() {
    let div = document.createElement('div');
    let header = document.createElement('div');
    let header1 = document.createElement('div');
    let header2 = document.createElement('div');
    let footer = document.createElement('div');
    let today = document.createElement('p');
    let a = completion_time.cloneNode(true);
    let b = answer_times.cloneNode(true);
    let x = getDay();
    today.innerHTML =` SPOT THE PLANE<br>${x}`;
    header1.append(today);
    header2.append(a);
    header.append(header1);
    header.append(header2);
    header.className = 'shareable-header';
    footer.append(b);
    div.append(header);
    div.append(footer);
    div.className = 'shareable';
    document.body.appendChild(div);
    html2canvas(div).then((canvas) => {
        if (typeof ClipboardItem != 'undefined') {
            canvas.toBlob((blob) => {
                let d = [new ClipboardItem({ 'image/png': blob })];
                navigator.clipboard.write(d).then(() => {
                    document.body.removeChild(div);
                    showToast('Results copied to clipboard');
                });
            });
        } else {
            results.classList.remove('animate__fadeOutDownBig');
            let img = new Image();
            img.src = canvas.toDataURL();
            img.className = 'results-image';
            results.appendChild(img);
            results.style.display = "block";
            results.classList.add('animate__fadeInUpBig');
            setTimeout(() => {
                showToast('Right click/hold to copy');
            }, 500);
        }
    });
}

function showToast(text) {
    toast.innerHTML = text;
    toast.style.visibility = 'visible';
    toast.classList.remove('animate__fadeOutUp');
    toast.classList.add('animate__fadeInDown');
    setTimeout(() => {
        toast.classList.remove('animate__fadeInDown');
        toast.classList.add('animate__fadeOutUp');
    }, 3000);
}

function getAnswer(answer) {
    let guess = document.getElementById(answer).getAttribute('value');
    if (guess == current_question[1]) {
        disableButtons();
        is_running = false;
        resetColors();
        document.getElementById(answer).style.background = "green";
        game_state.answers.push(window.getComputedStyle(counter[idx]).getPropertyValue('background-color'));
        idx++;
        shrinkButtons();
        if (idx < data.length) {
            initRound();
            callApi();
            setTimeout(() => {
                populateQuestions();
                resetButtons(); 
                is_running = true;
                trackCounter(); 
            }, 1250);
        } else {
            main_timer.stop();
            getAnswerTimes();
            completion_time.innerHTML = timer.children[0].innerHTML;
            game_state.completionTime = getTimeInMs(timer.children[0].innerHTML);
            game_state.status = 'complete';
            statistics.daysPlayed += 1;
            statistics.totalGameTime += game_state.completionTime;
            statistics.avgCompletionTime = statistics.totalGameTime / statistics.daysPlayed;
            statistics.avgTimePerQuestion = statistics.avgCompletionTime / 10;
            statistics.lastPlayed = day;
            localStorage.setItem('game_state', JSON.stringify(game_state));
            localStorage.setItem('statistics', JSON.stringify(statistics));
            setTimeout(() => {
                game.classList.add('animate__fadeOut');
            }, 1250);
            setTimeout(() => {
                postgame.style.display = 'flex';
                postgame.children[0].classList.add('animate__fadeInDown');
            }, 1750);
        }
    } else {
        document.getElementById(answer).disabled = true;
        document.getElementById(answer).style.background = 'red';
        main_timer.addTime();
        addClass(timer_ele, 'red-timer');
        incTracker();
    };
}
