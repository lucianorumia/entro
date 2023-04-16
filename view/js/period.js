import { Ymd, His, msToHis, msToDecHs, sameDay, MILISECONDS } from "./modules/dates.js";

const filterForm = document.getElementById('filter-form');
const userInp = document.getElementById('user');
const dateFromInp = document.getElementById('date-from');
const dateToInp = document.getElementById('date-to');
const applyFilters = document.getElementById('apply-flt');
const resetFilters = document.getElementById('reset-flt');
let preAccum;
let prePartial;

// let applyFiltersFlag = false;
// let resetFiltersFlag = true;

applyFilters.addEventListener('click', getMovements);

resetFilters.addEventListener('click', () => {
    filterForm.reset();
});

function updateTimes() {
    const nowTimeTd = document.getElementById('now-time');
    const nowPartialTd = document.getElementById('now-partial');
    const nowAccumTd = document.getElementById('now-accum');

    setInterval(() => {
        const now = new Date();
        const hisDatetime = His(now);
        const formatedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
        const partialMs = prePartial + now.getTime();
        const hisPartial = msToHis(partialMs);
        const partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
        const accumMs = preAccum + partialMs;  
        const accumDisplay = msToDecHs(accumMs, 2);
        const htmlElmts = [nowTimeTd, nowPartialTd, nowAccumTd];
        const textContent = [formatedTime, partialDisplay, accumDisplay];

        htmlElmts.forEach((elmt, i)=>{
            elmt.textContent = textContent[i];
        })
    }, 1000);
}

function getMovements() {
    const fran = document.getElementById('fran').value;
    const userKey = document.querySelector('#users-list option[value="' + userInp.value + '"]').getAttribute('data-user-key');
    const dateFrom = dateFromInp.value;
    const dateTo = dateToInp.value;
    const url = '/controller/form-action/period.php'

    const dataToSend = {
        fran: fran,
        userKey: userKey,
        dateFrom: dateFrom,
        dateTo: dateTo
    };

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(respData => {
        if (respData.success) {
            const userPeriodTable = document.getElementById('user-period-table');
            const userPeriodTbody = document.getElementById('user-period-tbody');
            userPeriodTbody.innerHTML = '';

            const qMovements = respData.movements.length;
            if (qMovements > 0) {
                let partialMs = 0;
                let accumMs = 0;
                let endsInside = false;

                respData.movements.forEach((movement, i) => {
                    const datetime = new Date(movement.datetime);
                    const ms = datetime.getTime();
                    let partialDisplay;
                    let accumDisplay;
                    let cssClass;

                    if (movement.type) {
                        partialMs -= ms;
                        if (i === qMovements - 1) {
                            endsInside = true;
                        }
                        partialDisplay = '';
                        accumDisplay = '';
                        cssClass = 'def-table__row-mark--entry';
                    } else {
                        partialMs += ms;

                        if (i === 0) {
                            const datetimeFrom = new Date(dateFromInp.value);
                            datetimeFrom.setTime(datetimeFrom.getTime() + datetimeFrom.getTimezoneOffset() * MILISECONDS.MIN);
                            partialMs -= datetimeFrom.getTime();

                            const ymdDatetime = Ymd(datetimeFrom);
                            const formatedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                            const startDayCaption = '00:00:00';

                            const newElement = document.createElement('tr');
                            const innerHtmlStr = `<td><div class="def-table__row-mark def-table__row-mark--start-of-day"></div></td>
                                <td>${formatedDate}</td>
                                <td>${startDayCaption}</td>
                                <td></td>
                                <td></td>
                                <td></td>`;
                            newElement.classList.add('def-table__body-row')
                            newElement.innerHTML = innerHtmlStr;
                            userPeriodTbody.appendChild(newElement);
                        }

                        const hisPartial = msToHis(partialMs);
                        partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
                        accumMs += partialMs; //increase accum
                        partialMs = 0; //reset partial
                        accumDisplay = msToDecHs(accumMs, 2);
                        cssClass = 'def-table__row-mark--exit';
                    }

                    const newElement = document.createElement('tr');
                    const ymdDatetime = Ymd(datetime);
                    const formatedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                    const hisDatetime = His(datetime);
                    const formatedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
                    const innerHtmlStr = `<td><div class="def-table__row-mark ${cssClass}"></div></td>
                        <td>${formatedDate}</td>
                        <td>${formatedTime}</td>
                        <td>${partialDisplay}</td>
                        <td>${accumDisplay}</td>
                        <td>
                            <a class="def-table__plus-btn" href="/index.php?view=movement&id=${movement.key}">+</a>
                        </td>`;
                    newElement.classList.add('def-table__body-row')
                    newElement.innerHTML = innerHtmlStr;
                    userPeriodTbody.appendChild(newElement);
                });

                if (endsInside) {
                    const now = new Date();
                    let datetimeTo = new Date(dateToInp.value);
                    let partialDisplay;
                    let accumDisplay;

                    datetimeTo.setTime(datetimeTo.getTime() + datetimeTo.getTimezoneOffset() * MILISECONDS.MIN);
                    if (sameDay(datetimeTo, now)) {
                        prePartial = partialMs;
                        partialMs += now.getTime();
                        preAccum = accumMs;
                        accumMs += partialMs;

                        const ymdDatetime = Ymd(now);
                        const formatedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                        const hisDatetime = His(now);
                        const formatedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
                        const hisPartial = msToHis(partialMs);
                        partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
                        accumDisplay = msToDecHs(accumMs, 2);

                        const newElement = document.createElement('tr');
                        const innerHtmlStr = `<td><div class="def-table__row-mark def-table__row-mark--inside-now"></div></td>
                            <td>${formatedDate}</td>
                            <td id="now-time">${formatedTime}</td>
                            <td id="now-partial">${partialDisplay}</td>
                            <td id="now-accum">${accumDisplay}</td>
                            <td></td>`;
                        newElement.classList.add('def-table__body-row')
                        newElement.innerHTML = innerHtmlStr;
                        userPeriodTbody.appendChild(newElement);

                        updateTimes();
                    } else {
                        datetimeTo.setTime(datetimeTo.getTime() + MILISECONDS.DAY);
                        partialMs += datetimeTo.getTime();
                        accumMs += partialMs;
                        
                        datetimeTo.setTime(datetimeTo.getTime() - 1);
                        const ymdDatetime = Ymd(datetimeTo);
                        const formatedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                        const hisPartial = msToHis(partialMs);
                        const endDayCaption = '24:00:00';
                        partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
                        accumDisplay = msToDecHs(accumMs, 2);

                        const newElement = document.createElement('tr');
                        const innerHtmlStr = `<td><div class="def-table__row-mark def-table__row-mark--end-of-day"></div></td>
                            <td>${formatedDate}</td>
                            <td>${endDayCaption}</td>
                            <td>${partialDisplay}</td>
                            <td>${accumDisplay}</td>
                            <td></td>`;
                        newElement.classList.add('def-table__body-row')
                        newElement.innerHTML = innerHtmlStr;
                        userPeriodTbody.appendChild(newElement);
                    }
                }
                userPeriodTable.style.visibility = "visible";
            } else {
                userPeriodTable.style.visibility = "hidden";
                alert('No hay movimientos del usuario en el rango de fechas que seleccionaste.');
            }
        } else {
            console.error(respData.errorMsg);    
            alert('Ha ocurrido un error!\nPonete en contacto con el administrador del sistema.');
        }
    })
    .catch(e => {
        console.error(e);
        alert('Ha ocurrido un error!\nPonete en contacto con el administrador del sistema.');
    })
}
