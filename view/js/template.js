import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal.js";

const menuBtn = document.getElementById('menu-btn');
const curtain = document.querySelector('.curtain');
const navigator = document.querySelector('.navigator');
const userBtn = document.getElementById('user-btn');
const userMenu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');
const modal = document.querySelector('.modal');

if (userBtn !== null) {
    menuBtn.onclick = () => toggleNavigator();
}

// if (userBtn !== null) {
//     userBtn.onclick = () => toggleUserMenu();
// }

if (logoutBtn !== null) {
    logoutBtn.addEventListener("click", () => {
        const modalTitle = 'Salir';
        const modalText = 'Estás seguro que querés salir de la aplicación?'
        const modalBtns = [MODAL_BUTTON.YES, MODAL_BUTTON.NO];
        setModal(modal, MODAL_MODE.QUESTION, modalTitle, modalText, modalBtns)
        
        modal.addEventListener('close', () => {
            const modalResp = parseInt(modal.returnValue);
            switch (modalResp) {
                case MODAL_BUTTON.YES.value:
                    window.location.href = "/controller/logout.php";
                    break;
            }
            resetModal(modal);
        }, {once: true});

        modal.showModal();
    });
}

function toggleNavigator() {
    curtain.classList.toggle('sprclss--display-none');
    navigator.classList.toggle('navigator--showed');
}

function toggleUserMenu() {
    userMenu.classList.toggle('sprclss--display-none');
}
