import { Ymd, His, msToHis, msToDecHs, sameDay, MILISECONDS } from "./modules/dates.js";
import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal";

const filterForm = document.getElementById('filter-form');
const userInp = document.getElementById('user');
const dateFromInp = document.getElementById('date-from');
const dateToInp = document.getElementById('date-to');
const applyFilters = document.getElementById('apply-flt');
const resetFilters = document.getElementById('reset-flt');
const userPeriodTbody = document.getElementById('user-period-tbody');
const rowMarkModifier = {
    entry: 'entry',
    exit: 'exit',
    startOfDay: 'start-of-day',
    endOfDay: 'end-of-day',
    insideNow: 'inside-now',
};
const modal = document.querySelector('.modal');
let preAccum;
let prePartial;

// let applyFiltersFlag = false;
// let resetFiltersFlag = true;

function addTableRow(markModifier, date, time, partial, accum, movementKey) {
    const newElement = document.createElement('tr');
    const insideNow = (markModifier === rowMarkModifier.insideNow);
    const plusBtn = (movementKey === undefined) ? '' : `<a class="def-table__plus-btn" href="/index.php?view=movement&id=${movementKey}">+</a>`
    const innerHtmlStr = `<td><div class="def-table__row-mark def-table__row-mark--${markModifier}"></div></td>
        <td>${date}</td>
        <td${insideNow ? ' id="now-time"' : ''}>${time}</td>
        <td${insideNow ? ' id="now-partial"' : ''}>${partial ?? ''}</td>
        <td${insideNow ? ' id="now-accum"' : ''}>${accum ?? ''}</td>
        <!-- <td>${plusBtn}</td> -->`
    newElement.classList.add('def-table__body-row')
    newElement.innerHTML = innerHtmlStr;
    userPeriodTbody.appendChild(newElement);
}

function updateTimes() {
    const nowTimeTd = document.getElementById('now-time');
    const nowPartialTd = document.getElementById('now-partial');
    const nowAccumTd = document.getElementById('now-accum');

    setInterval(() => {
        const now = new Date();
        const hisDatetime = His(now);
        const formattedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
        const partialMs = prePartial + now.getTime();
        const hisPartial = msToHis(partialMs);
        const partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
        const accumMs = preAccum + partialMs;  
        const accumDisplay = msToDecHs(accumMs, 2);
        const htmlElmts = [nowTimeTd, nowPartialTd, nowAccumTd];
        const textContent = [formattedTime, partialDisplay, accumDisplay];

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
                        cssClass = rowMarkModifier.entry;
                    } else {
                        partialMs += ms;

                        if (i === 0) {
                            const datetimeFrom = new Date(dateFromInp.value);
                            datetimeFrom.setTime(datetimeFrom.getTime() + datetimeFrom.getTimezoneOffset() * MILISECONDS.MIN);
                            partialMs -= datetimeFrom.getTime();

                            const ymdDatetime = Ymd(datetimeFrom);
                            const formattedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                            const startDayCaption = '00:00:00';

                            addTableRow(rowMarkModifier.startOfDay, formattedDate, startDayCaption);
                        }

                        const hisPartial = msToHis(partialMs);
                        partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
                        accumMs += partialMs;
                        partialMs = 0;
                        accumDisplay = msToDecHs(accumMs, 2);
                        cssClass = rowMarkModifier.exit;
                    }

                    const ymdDatetime = Ymd(datetime);
                    const formattedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                    const hisDatetime = His(datetime);
                    const formattedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;

                    addTableRow(cssClass, formattedDate, formattedTime, partialDisplay, accumDisplay, movement.key);
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
                        const formattedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                        const hisDatetime = His(now);
                        const formattedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
                        const hisPartial = msToHis(partialMs);
                        partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
                        accumDisplay = msToDecHs(accumMs, 2);

                        addTableRow(rowMarkModifier.insideNow, formattedDate, formattedTime, partialDisplay, accumDisplay);
                        updateTimes();
                    } else {
                        datetimeTo.setTime(datetimeTo.getTime() + MILISECONDS.DAY);
                        partialMs += datetimeTo.getTime();
                        accumMs += partialMs;
                        
                        datetimeTo.setTime(datetimeTo.getTime() - 1);
                        const ymdDatetime = Ymd(datetimeTo);
                        const formattedDate = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y}`;
                        const hisPartial = msToHis(partialMs);
                        const endDayCaption = '24:00:00';
                        partialDisplay = `${hisPartial.H}:${hisPartial.i}:${hisPartial.s}`;
                        accumDisplay = msToDecHs(accumMs, 2);

                        addTableRow(rowMarkModifier.endOfDay, formattedDate, endDayCaption, partialDisplay, accumDisplay);
                    }
                }
                userPeriodTable.style.visibility = "visible";
            } else {
                userPeriodTable.style.visibility = "hidden";

                let modalTitle = 'Nada que mostrar';
                let modalText = 'No hay movimientos para mostrar.<br>'
                    + 'Cambiá los criterios de búsqueda y volvé a aplicar el filtro.';
                let modalBtns = [MODAL_BUTTON.OK];
                setModal(modal, MODAL_MODE.INFO, modalTitle, modalText, modalBtns);

                modal.addEventListener('close', () => {
                    resetModal(modal);
                    userInp.select();
                }, {once: true});

                modal.showModal();
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

applyFilters.addEventListener('click', getMovements);

resetFilters.addEventListener('click', () => {
    filterForm.reset();
});