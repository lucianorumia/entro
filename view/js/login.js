import { CST_ERROR } from "/view/js/modules/errors";
import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal";
import { VLDT_TYPE, VltdField, vldtForm, vldtSetListeners } from "/view/js/modules/validations";

const loginFrm = document.getElementById('login-frm');
const userInp = document.getElementById('user-inp');
const passInp = document.getElementById('pass-inp');
const submitBtn = document.getElementById('login-submit');

const modal = document.querySelector('.modal');

function loginRqst() {
    const url = '/controller/form-action/login.php'
    const dataToSend = new FormData(loginFrm);
    
    fetch(url, {
        method: 'POST',
        body: dataToSend,
    })
    .then(response => response.json())
    .then(respData => {
        if (respData.success) {
            window.location.replace(respData.location);
        } else {
            const modalMode = MODAL_MODE.ERROR;
            const modalBtns = [MODAL_BUTTON.OK];
            let modalTitle, modalText;

            switch (respData.error) {
                case CST_ERROR.CST1001.code:
                    modalTitle = CST_ERROR.CST1001.modal.title;
                    modalText = CST_ERROR.CST1001.modal.text;
                    setModal(modal, modalMode, modalTitle, modalText, modalBtns);
                
                    modal.addEventListener('close', () => {
                        resetModal(modal);
                        loginFrm.reset();
                        userInp.focus();
                    }, {once: true});
                
                    modal.showModal();
                    break;
            
                default:
                    console.error(respData.error);
                    modalTitle = CST_ERROR.CST099.modal.title;
                    modalText = CST_ERROR.CST099.modal.text;
                    setModal(modal, modalMode, modalTitle, modalText, modalBtns);
                
                    modal.addEventListener('close', () => {
                        resetModal(modal);
                    }, {once: true});
                
                    modal.showModal();
                    break;
            }
        }
    })
    .catch(e => {
        console.error(e);

        const modalMode = MODAL_MODE.ERROR;
        const modalBtns = [MODAL_BUTTON.OK];
        let modalTitle, modalText;
        
        modalTitle = CST_ERROR.CST099.modal.title;
        modalText = CST_ERROR.CST099.modal.text;
        setModal(modal, modalMode, modalTitle, modalText, modalBtns);
    
        modal.addEventListener('close', () => {
            resetModal(modal);
        }, {once: true});
    
        modal.showModal();
    })
}

// Validations -----------------------------------------------------------------
const userVldt = new VltdField(userInp, [{type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'}], new Event('input'));
const passVldt = new VltdField(passInp, [{type: VLDT_TYPE.REQUIRED, text: 'Campo requerido'}], new Event('input'));
const vldtFieldsArray = [userVldt, passVldt];

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const validForm = vldtForm(vldtFieldsArray);
    if (validForm) {
        loginRqst();
    } else {
        vldtSetListeners(vldtFieldsArray);
    }
});
