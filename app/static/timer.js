class Timer {
    constructor(ele) {
        var timer = createTimer(), offset, clock, interval;
        ele.append(timer);
        reset();

        function createTimer() {
            return document.createElement("span");
        }

        function start() {
            if (!interval) {
                offset = Date.now();
                interval = setInterval(update);
            }
        }

        function stop() {
            if (interval) {
                clearInterval(interval);
                interval = null; 
            }
        }

        function reset() {
            clock = 0.0;
            render(0.0);
        }

        function update(add=false) {
            clock += delta();
            if (add) {
                clock += add;
            }
            render();
        }

        function render() {
            var ms = parseInt((clock%1000)/10);
            var ss = parseInt((clock/1000)%60);
            var mm = parseInt((clock/(1000*60))%60);
            var leadZeroTime = [mm, ss, ms].map(time => time < 10 ? `0${time}` : time);
            timer.innerHTML = `${leadZeroTime[0]}:${leadZeroTime[1]}.${leadZeroTime[2]}`;
        }

        function delta() {
            var now = Date.now(), d = now - offset;
            offset = now;
            return d;
        }

        function addTime() {
            update(10000);
        }

        this.start = start;
        this.stop = stop;
        this.reset = reset;
        this.addTime = addTime;
    }
}

// create countdown timer

function getTomorrow() {
    var today = new Date();
    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1)
    tomorrow.setHours(0,0,0,0);
    return tomorrow.getTime();
}

var tomorrow = getTomorrow();
var countdown = setInterval(() => {
    var today = new Date().getTime();
    var distance = tomorrow - today;
    var hh = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mm = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var ss = Math.floor((distance % (1000 * 60)) / 1000); 
    var leadZeroTime = [hh, mm, ss].map(time => time < 10 ? `0${time}` : time);
    document.getElementById('countdown').children[1].innerHTML = `${leadZeroTime[0]}:${leadZeroTime[1]}:${leadZeroTime[2]}`;
    if (distance < 0) {
        document.getElementById('countdown').children[1].innerHTML = 'Refresh to play now!';
        document.getElementById('countdown').children[1].style.fontSize = '21px';
        clearInterval(countdown);
    }
}, 1000);
