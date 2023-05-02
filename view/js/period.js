import { Ymd, His, msToHis, msToDecHs, sameDay, MILISECONDS } from "./modules/dates.js";
import { VLDT_TYPE, VltdField, vldtForm, vldtSetListeners, vldtUnset } from "/view/js/modules/validations";
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

// Validations -----------------------------------------------------------------
const userVldt = new VltdField(userInp, [{type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'}], new Event('input'));
const vldtFieldsArray = [userVldt];

    // Local Vldtns
        // User
const userEventHandler = () => {
    if (userList.includes(userInp.value)
        || userInp.value === '') {
        userInp.classList.remove('vldt__field--invalid');
        userInp.parentNode.querySelector('.vldt__caption').textContent = '';
        return true;
    } else {
        userInp.classList.add('vldt__field--invalid');
        userInp.parentNode.querySelector('.vldt__caption').textContent = 'Usuario inexistente';
        return false;
    }
}

userInp.addEventListener('blur', (e) => {
    if (userEventHandler()) {
        userInp.removeEventListener('input', userEventHandler);
    } else {
        e.target.select();
        userInp.addEventListener('input', userEventHandler);
    }
});

        // Dates
const dateRegExp = /\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;

const dateEventHandler = (e) => {
    if (! dateRegExp.test(e.target.value)) {
        e.target.classList.add('vldt__field--invalid');
        e.target.parentNode.querySelector('.vldt__caption').textContent = 'Ingresá fecha válida';
        return false;
    } else if (dateFromInp.value > dateToInp.value) {
        e.target.classList.add('vldt__field--invalid');
        e.target.parentNode.querySelector('.vldt__caption').textContent = 'La fecha desde debe ser anterior o igual a la fecha Hasta';
        return false;
    } else {
        e.target.classList.remove('vldt__field--invalid');
        e.target.parentNode.querySelector('.vldt__caption').textContent = '';
        return true;
    }
}

dateFromInp.addEventListener('blur', (e) => {
    const vldtDateFrom = dateEventHandler(e); 
    if (vldtDateFrom) {
        dateFromInp.removeEventListener('input', dateEventHandler.bind(e));
    } else {
        e.target.select();
        dateFromInp.addEventListener('input', dateEventHandler.bind(e));
    }
});

dateToInp.addEventListener('blur', (e) => {
    const vldtDateTo = dateEventHandler(e); 
    if (vldtDateTo) {
        dateToInp.removeEventListener('input', dateEventHandler.bind(e));
    } else {
        e.target.select();
        dateToInp.addEventListener('input', dateEventHandler.bind(e));
    }
});

const localVldt = () => {
    if (userList.includes(userInp.value)
        &&dateRegExp.test(dateFromInp.value)
        && dateRegExp.test(dateToInp.value)
        && dateFromInp.value <= dateToInp.value) return true;
    else return false;
}

const localVldtUnset = () => {
    const localVldtFields = [userInp, dateFromInp, dateToInp];
    localVldtFields.forEach(field => {
        field.classList.remove('vldt__field--invalid');
        field.parentNode.querySelector('.vldt__caption').textContent = '';
    });
}

// Validations end -------------------------------------------------------------

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

applyFilters.addEventListener('click', () => {
    const validForm = (vldtForm(vldtFieldsArray) && localVldt());
    if (validForm) {
        getMovements();
    } else {
        vldtSetListeners(vldtFieldsArray);
    }
});

resetFilters.addEventListener('click', () => {
    vldtUnset(vldtFieldsArray);
    localVldtUnset();
    filterForm.reset();
});