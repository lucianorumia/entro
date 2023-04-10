import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal";

const modal = document.querySelector('.modal'); 

const userForm = document.getElementById('user-form');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');
const backBtn = document.getElementById('back-btn');

updateBtn.addEventListener('click', () => {
    let modalTitle = 'Ups!';
    let modalText = 'Funcionalidad en construcción.<br>'
        + 'Estamos trabajando para habilitarla lo antes posible.';
    let modalBtns = [MODAL_BUTTON.OK];
    setModal(modal, MODAL_MODE.INFO, modalTitle, modalText, modalBtns)

    modal.showModal();
});

deleteBtn.addEventListener('click', () => {
    let modalTitle = 'Eliminar';
    let modalText = 'Estás seguro que qurés eliminar el usuario?'
    let modalBtns = [MODAL_BUTTON.YES, MODAL_BUTTON.NO];
    setModal(modal, MODAL_MODE.QUESTION, modalTitle, modalText, modalBtns)
    
    modal.addEventListener('close', () => {
        const modalResp = parseInt(modal.returnValue);
        switch (modalResp) {
            case MODAL_BUTTON.YES.value:
                userForm.action = "/controller/form-action/user-delete.php";
                userForm.submit();
                break;
        }
        resetModal(modal);
    }, {once: true});

    modal.showModal();
});

backBtn.addEventListener('click', () => location.href = '/users');
