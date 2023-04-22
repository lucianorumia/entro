import { Ymd, His } from "./modules/dates.js";
import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal";

const filterForm = document.getElementById('filter-form');
const userInp = document.getElementById('user');
const locationInp = document.getElementById('location');

const applyFilters = document.getElementById('apply-flt');
const resetFilters = document.getElementById('reset-flt');

const modal = document.querySelector('.modal'); 

function getMovements() {
    const fran = document.getElementById('fran').value;
    const crtrUser = document.getElementById('user').value.trim();
    const location = document.getElementById('location').value;
    const url = '/controller/form-action/now.php';

    const dataToSend = {
        fran: fran,
        crtrUser: crtrUser ? crtrUser : null,
        location: location === '-1' ? null : parseInt(location),
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
            const nowTable = document.getElementById('now-table');
            const nowTbody = nowTable.querySelector('tbody');
            
            nowTbody.innerHTML = '';

            const qMovements = respData.movements.length;
            if (qMovements > 0) {
                respData.movements.forEach(mov => {
                    const rowMarkModifier = mov.location ? 'inside' : 'exit';
                    const strLocation = mov.location ? 'dentro' : 'fuera';
                    let formattedDatetime;
                    if (mov.datetime) {
                        const datetime = new Date(mov.datetime);
                        const ymdDatetime = Ymd(datetime);
                        const hisDatetime = His(datetime);
                        formattedDatetime = `${ymdDatetime.d}/${ymdDatetime.m}/${ymdDatetime.Y} ${hisDatetime.H}:${hisDatetime.i}:${hisDatetime.s}`;
                    } else {
                        formattedDatetime = '(aún sin movimientos)';
                    }
                    
                    const newElement = document.createElement('tr');
                    const innerHtmlStr = `<td><div class="def-table__row-mark def-table__row-mark--${rowMarkModifier}"></div></td>
                        <td>${mov.user}</td>
                        <!-- <td>${strLocation}</td> -->
                        <td>${formattedDatetime}</td>`
                    newElement.classList.add('def-table__body-row')
                    newElement.innerHTML = innerHtmlStr;
                    nowTbody.appendChild(newElement);
                });

                nowTable.style.visibility = "visible"
            } else {
                nowTable.style.visibility = "hidden"

                let modalTitle = 'Nada que mostrar';
                let modalText = 'No hay empleados que cumplan con el filtro selecionado.<br>'
                    + 'Cambiá el criterio y volvé a aplicar el filtro.';
                let modalBtns = [MODAL_BUTTON.OK];
                setModal(modal, MODAL_MODE.INFO, modalTitle, modalText, modalBtns);

                modal.addEventListener('close', () => {
                    locationInp.focus();
                    resetModal(modal);
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

document.addEventListener('DOMContentLoaded', getMovements);

applyFilters.addEventListener('click', getMovements);

resetFilters.addEventListener('click', () => {
    filterForm.reset();
});