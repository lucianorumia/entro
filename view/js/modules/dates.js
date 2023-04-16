const MILISECONDS = {
    SEC: 1e3,
    MIN: 1e3*60,
    HOUR: 1e3*60*60,
    DAY: 1e3*60*60*24
}

function utcToLocalDate(utcDatetime) {
    let date = new Date(utcDatetime);
    date.setTime(date.getTime() - date.getTimezoneOffset() * MILISECONDS.MIN);

    return date;
}

function msToHis(ms) {
    let rest = ms;
    const h = twoDigitsStr(Math.floor(rest / MILISECONDS.HOUR));
    rest -= h * MILISECONDS.HOUR;
    const i = twoDigitsStr(Math.floor(rest / MILISECONDS.MIN));
    rest -= i * MILISECONDS.MIN;
    const s = twoDigitsStr(Math.floor(rest / MILISECONDS.SEC));

    const his = {
        H:h,
        i:i,
        s:s
    }

    return his;
}

function msToDecHs(ms, decDig) {
    const numHs = ms / MILISECONDS.HOUR;
    const strHs = numHs.toLocaleString(undefined, {
        minimumFractionDigits: decDig,
        maximumFractionDigits: decDig,
    });

    return strHs;
}

function hsMinElapsed(date1, date2) {
    const time = date2.getTime() - date1.getTime();
    const hs =  Math.floor(time / MILISECONDS.HOUR);
    const min = Math.floor((time - hs * MILISECONDS.HOUR) / MILISECONDS.MIN);

    const hsMin = {
        hs:hs,
        min:min
    }

    return hsMin
}

function sameDay(date1, ...dates) {
    const refDate = date1.getDate();
    const refMonth = date1.getMonth();
    const refYear = date1.getFullYear();

    for (let i = 0; i < dates.length; i++) {
        const compDate = dates[i].getDate();
        const compMonth = dates[i].getMonth();
        const compYear = dates[i].getFullYear();
        
        if(refDate !== compDate
            || refMonth !== compMonth
            || refYear !== compYear) {
            return false;
        };
    }

    return true;
}

function sameDays(date1, ...dates) {
    let refDay = absDay(date1);

    for (let i = 0; i < dates.length; i++) {
        if(!(absDay(dates[i]) === refDay)) {
            return false;
        };
    }

    return true;
}

function absDay(date) {
    const timezoneOffsetMs = date.getTimezoneOffset() * MILISECONDS.MIN;
    const res = Math.floor((date.getTime() - timezoneOffsetMs) / MILISECONDS.DAY);

    return res;
}

function Ymd(date) {
    const Y = date.getFullYear();
    const m = twoDigitsStr(date.getMonth() + 1);
    const d = twoDigitsStr(date.getDate());

    const ymd = {
        Y:Y,
        m:m,
        d:d
    }

    return ymd;
}

function His(date) {
    const H = twoDigitsStr(date.getHours());
    const i = twoDigitsStr(date.getMinutes());
    const s = twoDigitsStr(date.getSeconds());

    const his = {
        H:H,
        i:i,
        s:s
    }

    return his;
}

function DjMHis(date) {
    const D = weekDayStr(date.getDay());
    const j = date.getDate();
    const M = monthStr(date.getMonth());
    const H = twoDigitsStr(date.getHours());
    const i = twoDigitsStr(date.getMinutes());
    const s = twoDigitsStr(date.getSeconds());

    const djmhis = {
        D:D,
        j:j,
        M:M,
        H:H,
        i:i,
        s:s
    }

    return djmhis 
}

function twoDigitsStr(i) {
    if (i < 10) {
        i = '0' + i;
    }

    return i;
}

function weekDayStr(i) {
    const days = [
        'DOM',
        'LUN',
        'MAR',
        'MIE',
        'JUE',
        'VIE',
        'SAB'
    ];
    let weekDay = days[i];
    
    return weekDay;
}

function monthStr(i) {
    const months = [
        'ENE',
        'FEB',
        'MAR',
        'ABR',
        'MAY',
        'JUN',
        'JUL',
        'AGO',
        'SEP',
        'OCT',
        'NOV',
        'DIC'
    ];
    let month = months[i];
    
    return month;
}

export {
    MILISECONDS,
    utcToLocalDate,
    msToHis,
    msToDecHs,
    hsMinElapsed,
    sameDay,
    sameDays,
    absDay,
    Ymd,
    His,
    DjMHis,
    twoDigitsStr,
    weekDayStr,
    monthStr
};
