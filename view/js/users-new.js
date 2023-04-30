import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal";

const userForm = document.getElementById('user-form');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const modal = document.querySelector('.modal'); 

function validateForm() {
    return true;
}

saveBtn.addEventListener('click', () => {
    let modalTitle, modalText, modalBtns;

    if (validateForm()) {
        modalTitle = 'Guardar';
        modalText = 'Estás seguro que qurés registrar el usuario?'
        modalBtns = [MODAL_BUTTON.YES, MODAL_BUTTON.NO];
        setModal(modal, MODAL_MODE.QUESTION, modalTitle, modalText, modalBtns)
        
        modal.addEventListener('close', () => {
            const modalResp = parseInt(modal.returnValue);
            switch (modalResp) {
                case MODAL_BUTTON.YES.value:
                    userForm.action = "/controller/form-action/user-create.php";
                    userForm.submit();
                    break;
            }
            resetModal(modal);
        }, {once: true});

        modal.showModal();
    } else {
        modalTitle = 'Ups!';
        modalText = 'Parece que hay un error de validación.<br>'
            + 'Revisá que todos los campos estén completados<br>'
            + 'y cumplan con los requerimientos.'
        modalBtns = [MODAL_BUTTON.OK];
        setModal(modal, MODAL_MODE.WARNING, modalTitle, modalText, modalBtns)

        modal.addEventListener('close', () => {
            resetModal(modal);
        }, {once: true});

        modal.showModal();
    }
});

cancelBtn.addEventListener('click', () => location.href = '/users');