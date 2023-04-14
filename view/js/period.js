import { Ymd, His, msToHis, msToDecHs, MILISECONDS } from "./modules/dates.js";

const filterForm = document.getElementById('filter-form');
const userInp = document.getElementById('user');
const dateFromInp = document.getElementById('date-from');
const dateToInp = document.getElementById('date-to');
const applyFilters = document.getElementById('apply-flt');
const resetFilters = document.getElementById('reset-flt');

// let applyFiltersFlag = false;
// let resetFiltersFlag = true;

applyFilters.addEventListener('click', getMovements);

resetFilters.addEventListener('click', () => {
    filterForm.reset();
});

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
            const qMovements = respData.movements.length;
            if (qMovements > 0) {
                let partialMs = 0;
                let accumMs = 0;
                let endsInside = false;
                const userPeriodTbody = document.getElementById('user-period-tbody');
                userPeriodTbody.innerHTML = '';

                respData.movements.forEach((movement, i) => {
                    const datetime = new Date(movement.datetime);
                    const ms = datetime.getTime();
                    let partial;
                    let accum;
                    let cssClass;

                    if (movement.type) {
                        partialMs -= ms;
                        accumMs -= ms;
                        if (i === qMovements - 1) {
                            endsInside = true;
                        }
                        partial = '';
                        accum = '';
                        cssClass = 'def-table__row-mark--entry';
                    } else {
                        partialMs += ms;
                        accumMs += ms;
                        if (i === 0) {
                            const datetimeFrom = new Date(dateFromInp.value);
                            datetimeFrom.setTime(datetimeFrom.getTime() + datetimeFrom.getTimezoneOffset() * MILISECONDS.MIN);
                            partialMs -= datetimeFrom.getTime();
                            accumMs -= datetimeFrom.getTime();
                        }
                        const hisPartialMs = msToHis(partialMs);
                        partial = `${hisPartialMs.H}:${hisPartialMs.i}:${hisPartialMs.s}`;
                        partialMs = 0;
                        accum = msToDecHs(accumMs, 2);
                        cssClass = 'def-table__row-mark--exit';
                    }

                    const newElement = document.createElement('tr');
                    const ymdDatetime = Ymd(datetime);
                    const formatedDate = `${ymdDatetime.d}-${ymdDatetime.m}-${ymdDatetime.Y}`;
                    const hisDatetime = His(datetime);
                    const formatedTime = `${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
                    const innerHtmlStr = `<td><div class="def-table__row-mark ${cssClass}"></div></td>
                        <td>${formatedDate}</td>
                        <td>${formatedTime}</td>
                        <td>${partial}</td>
                        <td>${accum}</td>
                        <td>
                            <a class="def-table__plus-btn" href="/index.php?view=movement&id=${movement.key}">+</a>
                        </td>`;
                    newElement.classList.add('def-table__body-row')
                    newElement.innerHTML = innerHtmlStr;
                    userPeriodTbody.appendChild(newElement);    
                });
            } else {
                alert('No hay movimientos para mostrar');
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
