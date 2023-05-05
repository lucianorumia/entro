import { MODAL_MODE, MODAL_BUTTON, setModal, resetModal } from "/view/js/modules/modal.js";

const fltForm = document.getElementById('flt-form')
const nameInp = document.getElementById('name');
const roleInp = document.getElementById('rol-id');
const applyFtr = document.getElementById('apply-flt');
const resetFtr = document.getElementById('reset-flt');
const modal = document.querySelector('.modal');

getUsers();

applyFtr.onclick = getUsers;
resetFtr.onclick = () => {
    fltForm.reset();
};

function getUsers() {
    const fran = document.getElementById('fran').value;
    const name = (nameInp.value.trim() !== '') ? nameInp.value.trim() : null;
    const roleId = (roleInp.value !== '0') ? parseInt(roleInp.value) : null;
    const url = '/controller/form-action/users.php'

    const dataToSend = {
        fran: fran,
        name: name,
        roleId: roleId
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
            const usersTable = document.getElementById('users-table');
            if (respData.users.length > 0) {
                const usersTblBody = usersTable.querySelector('tbody');
                usersTblBody.innerHTML = '';

                respData.users.forEach(user => {
                    const newElement = document.createElement('tr');
                    const innerHtmlStr = `<td><div class="def-table__row-mark def-table__row-mark--def"></div></td>
                        <td>${user.name}</td>
                        <td>${user.role}</td>
                        <td>${user.email}</td>
                        <td>
                            <a class="def-table__plus-btn" href="/users/${user.key}">+</a>
                        </td>`;
                    
                    newElement.classList.add('def-table__body-row')
                    newElement.innerHTML = innerHtmlStr;
                    usersTblBody.appendChild(newElement);    
                });
                usersTable.style.visibility = "visible";
            } else {
                usersTable.style.visibility = "hidden";

                let modalTitle = 'Ups!';
                let modalText = 'No hay usuarios para mostrar.<br>'
                    + 'Cambiá los criterios de búsqueda y volvé a aplicar el filtro.';
                let modalBtns = [MODAL_BUTTON.OK];
                setModal(modal, MODAL_MODE.INFO, modalTitle, modalText, modalBtns);

                modal.addEventListener('close', () => {
                    resetModal(modal);
                    nameInp.select();
                }, {once: true});

                modal.showModal();
            }
        } else {
            alert('Ha ocurrido un error!\nPonete en contacto con el administrador del sistema.');
            console.error(respData.errorMsg);    
        }
    })
    .catch(e => {
        console.error(e);
        alert('Ha ocurrido un error!\nPonete en contacto con el administrador del sistema.');
    })
}

// From Modals
const urlParamsStr = window.location.search;
const urlParams = new URLSearchParams(urlParamsStr);
const urlFrom = urlParams.get('from');
const urlSucc = urlParams.has('succ') ? urlParams.get('succ') : null;

let modalMode, modalTitle, modalText;
const modalBtns = [MODAL_BUTTON.OK];

if (urlFrom !== null) {
    switch (urlFrom) {
        case 'new':
            switch (urlSucc) {
                case 'true':
                    modalMode = MODAL_MODE.INFO;
                    modalTitle = 'Listo!';
                    modalText = 'El usuario se registró con éxito.'
                    break;
            
                case 'false':
                    modalMode = MODAL_MODE.ERROR;
                    modalTitle = 'Ups!';
                    modalText = 'No pudimos registrar el usuario.<br>'
                        + 'Ponete en contacto con el administrador del sistema';
                    break;
            }
            break;

        case 'delete':
            switch (urlSucc) {
                case 'true':
                    modalMode = MODAL_MODE.INFO;
                    modalTitle = 'Listo!';
                    modalText = 'El usuario fue eliminado con éxito.'
                    break;
            
                case 'false':
                    modalMode = MODAL_MODE.ERROR;
                    modalTitle = 'Ups!';
                    modalText = 'No pudimos eliminar el usuario.<br>'
                        + 'Ponete en contacto con el administrador del sistema';
                    break;
            }
            break;
    }

    setModal(modal, modalMode, modalTitle, modalText, modalBtns);

    modal.addEventListener('close', () => {
        resetModal(modal);
    }, {once: true});

    modal.showModal();
}
