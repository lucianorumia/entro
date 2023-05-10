import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal.js";
import { VLDT_TYPE, VltdField, vldtForm, vldtSetListeners, vldtUnset } from "/view/js/modules/validations.js";

const userForm = document.getElementById('user-form');
const nameInp = document.getElementById('name');
const emailInp = document.getElementById('email');
const passInp = document.getElementById('pass');
const matchPassInp = document.getElementById('match-pass');

const cancelBtn = document.getElementById('cancel-btn');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');
const modal = document.querySelector('.modal'); 

// Validations -----------------------------------------------------------------
const nameVldt = new VltdField(nameInp, [{type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'}], new Event('input'));
const emailRegexp = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const emailVldt = new VltdField(emailInp, [{type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'},
        {type: VLDT_TYPE.REG_EXP, regExp: emailRegexp, text: 'Ingresá email válido'}
    ], new Event('input'));
const passVldt = new VltdField(passInp, [{type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'}/*,
        {type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'}*/
    ], new Event('input'));

const vldtFieldsArray = [nameVldt, emailVldt, passVldt];

const matchPassVldt = () => {
    if (passInp.value !== matchPassInp.value) {
        matchPassInp.classList.add('vldt__field--invalid');
        matchPassInp.parentNode.querySelector('.vldt__caption').textContent = 'Las contraseñas no coinciden';

        return false;
    } else {
        matchPassInp.classList.remove('vldt__field--invalid');
        matchPassInp.parentNode.querySelector('.vldt__caption').textContent = '';

        return true;
    }
};

passInp.addEventListener('input', matchPassVldt);
matchPassInp.addEventListener('input', matchPassVldt);

saveBtn.addEventListener('click', () => {
    const validForm = (vldtForm(vldtFieldsArray) && matchPassVldt());
    let modalTitle, modalText, modalBtns;

    if (validForm) {
        modalTitle = 'Guardar';
        modalText = 'Estás seguro que qurés registrar el usuario?'
        modalBtns = [MODAL_BUTTON.YES, MODAL_BUTTON.NO];
        setModal(modal, MODAL_MODE.QUESTION, modalTitle, modalText, modalBtns)
        
        modal.addEventListener('close', () => {
            const modalResp = parseInt(modal.returnValue);
            switch (modalResp) {
                case MODAL_BUTTON.YES.value:
                    userForm.action = "/controller/form-action/user-new.php";
                    userForm.submit();
                    break;
            }
            resetModal(modal);
        }, {once: true});

        modal.showModal();
    } else {
        vldtSetListeners(vldtFieldsArray);
    }
});

resetBtn.addEventListener('click', () => {
    vldtUnset(vldtFieldsArray);
    matchPassInp.classList.remove('vldt__field--invalid');
    matchPassInp.parentNode.querySelector('.vldt__caption').textContent = '';
})

cancelBtn.addEventListener('click', () => location.href = '/users');
