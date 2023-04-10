const MODAL_MODE = Object.freeze({
    NONE: {id: 0, attrClass: null},
    INFO: {id: 1, attrClass: 'info'},
    WARNING: {id: 2, attrClass: 'warning'},
    ERROR: {id: 2, attrClass: 'error'},
    QUESTION: {id: 4, attrClass: 'question'},
})

const MODAL_BUTTON = Object.freeze({
    OK: {value: 0, caption: 'Ok'},
    YES: {value: 1, caption: 'Sí'},
    NO: {value: 2, caption: 'No'},
    CANCEL: {value: 3, caption: 'Cancelar'},
    RETRY: {value: 4, caption: 'Reintentar'},
})

function setModal(modalElmt, mode, title, text, btns = [MODAL_BUTTON.OK]) {
    modalElmt.classList.add(`modal--${mode.attrClass}`);
    
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal__header');
    modalHeader.innerHTML = `<div class="modal__icon"></div>
        <h3 class="modal__title">${title}</h3>`;
    modalElmt.appendChild(modalHeader);

    const modalText = document.createElement('p');
    modalText.classList.add('modal__text');
    modalText.innerHTML = text;
    modalElmt.appendChild(modalText);

    const modalBtns = document.createElement('form');
    modalBtns.classList.add('modal__form');
    modalBtns.method = 'dialog';
    let htmlStr = '';
    btns.forEach(btn => {
        htmlStr += `<button class="modal__button" type="submit" value="${btn.value}">${btn.caption}</button>`
    });
    modalBtns.innerHTML = htmlStr;
    modalElmt.appendChild(modalBtns);
}

function resetModal(modalElmt){
    modalElmt.className = 'modal';
    modalElmt.innerHTML = '';
}

export {
    MODAL_MODE,
    MODAL_BUTTON,
    setModal,
    resetModal
};