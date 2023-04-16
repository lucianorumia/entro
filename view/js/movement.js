import { utcToLocalDate, DjMHis, hsMinElapsed, sameDays } from "./modules/dates.js";

const multiX = document.querySelector('.sprclss--multi-x');
const movementBtn = document.querySelector('.movement__button');
const clockDate = document.getElementById('clock-date');
const clockTime = document.getElementById('clock-time');
const confirmFrm = document.querySelector('.confirm-form');
const movTypeElm = document.querySelector('.confirm-form__movement-type');
const confirmInps = document.querySelectorAll('.confirm-form__input');
const passInp = document.getElementById('pass-input');
const confirmBtns = document.querySelectorAll('.confirm-form__button');
const cancelBtn = document.getElementById('cancel-btn');
const okBtn = document.getElementById('confirm-btn');
const insideInfo = document.querySelector('.movement__info');
const entryDateElm = document.getElementById('entry-date');
const entryTimeElm = document.getElementById('entry-time');
const timeElapsedElm = document.getElementById('time-elapsed');

function setLocalLastMovDatetime() {
    if (lastMov.datetime !== null) {
        lastMov.datetime = utcToLocalDate(lastMov.datetime);
    }
}

function setDisplay() {
    setInterval(setClocks, 1000);

    if (lastMov.state) {
        movementBtn.classList.add('movement__button--inside');
        insideInfo.classList.remove('sprclss--display-none');
        movTypeElm.classList.add('confirm-form__movement-type--inside');
        confirmInps.forEach(element => {
            element.classList.add('confirm-form__input--inside');
        });
        confirmBtns.forEach(element => {
            element.classList.add('confirm-form__button--inside');
        });
    } else {
        movementBtn.classList.remove('movement__button--inside');
        insideInfo.classList.add('sprclss--display-none');
        movTypeElm.classList.remove('confirm-form__movement-type--inside');
        confirmInps.forEach(element => {
            element.classList.remove('confirm-form__input--inside');
        });
        confirmBtns.forEach(element => {
            element.classList.remove('confirm-form__button--inside');
        });
    }
}

function setClocks() {
    const now = new Date();
    const nowDjmhis = DjMHis(now);
    clockDate.textContent = `${nowDjmhis.D} ${nowDjmhis.j} de ${nowDjmhis.M}`;
    clockTime.textContent = `${nowDjmhis.H}:${nowDjmhis.i}:${nowDjmhis.s}`;

    if (lastMov.state) {
        const lastEntry = new Date(lastMov.datetime);
        const lastEntryDjmhis = DjMHis(lastEntry);
        const timeElapsed = hsMinElapsed(lastEntry, now);

        if (!sameDays(lastEntry, now)) {
            entryDateElm.textContent = `${lastEntryDjmhis.j} de ${lastEntryDjmhis.M}, `;
        }
        entryTimeElm.textContent = `${lastEntryDjmhis.H}:${lastEntryDjmhis.i}:${lastEntryDjmhis.s}`;
        timeElapsedElm.textContent = `${timeElapsed.hs}hs ${timeElapsed.min}min`;
    }
}

function saveMovement() {
    let dataSent = {};
    let dateTime = new Date();
    // const msjStr = document.getElementById('msg-input').value.trim();
    
    dataSent.fran = fran;
    dataSent.userKey = userKey;
    dataSent.movTypeId = !lastMov.state;
    dataSent.dateTime = dateTime;
    dataSent.pass = passInp.value;
    /*(msjStr == '') ?
        dataSent.msg = null
        : dataSent.msg = msjStr;*/

    fetch('/controller/movement-rqst.php', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSent),
    })
    .then(response => response.json())
    .then(respData => {
        processResponse(respData, dateTime);
    })
    .catch(error => {
        alert('Ha ocurrido un error!\nPonete en contacto con el administrador del sistema');
        console.error(error);
    })
}

function processResponse(data, dateTime)  {
    let movType;
    let msg;

    lastMov.state ?
        movType = 'salida'
        : movType = 'entrada';  

    if (data.success) {
        lastMov.state = !lastMov.state;
        lastMov.datetime = dateTime;
        focusXSlide(multiX, 0);
        setDisplay();
        confirmFrm.reset();
        msg = 'La ' + movType + ' ha sido registrada con éxito.';
    } else {
        switch (data.errorCode) {
            case 3:
                msg = "Contraseña inválida. Volvé a intentarlo...";
                passInp.value = '';
                passInp.focus();
                break;
            default:
                msg = 'No pudo registrarse la ' + movType + '.\nPonete en contacto con el admisistrador del sistema';
                break;
        }
    }
    alert(msg);
}

document.addEventListener('DOMContentLoaded', () => {
    setLocalLastMovDatetime();
    setClocks();
    setDisplay();
    movementBtn.addEventListener('click', () => focusXSlide(multiX, 1));
    cancelBtn.addEventListener('click', () => {
        focusXSlide(multiX, 0);
        confirmFrm.reset();
    });
    okBtn.addEventListener('click', (e) => {
        e.preventDefault();
        saveMovement();
    });
});

// Display functions -----------------------------------------------------------
function focusXSlide(multiX, index) {
    index ?
        multiX.style.left = `-${index * 100}vw`
        : multiX.style.left = '0';
}
