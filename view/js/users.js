const fltForm = document.getElementById('flt-form')
const nameInp = document.getElementById('name');
const roleInp = document.getElementById('rol-id');
const applyFtr = document.getElementById('apply-flt');
const resetFtr = document.getElementById('reset-flt');

getUsers();

applyFtr.onclick = getUsers;
resetFtr.onclick = () => {
    fltForm.reset();
};

function getUsers() {
    const fran = document.getElementById('fran').value;
    const name = (nameInp.value.trim() !== '') ? nameInp.value.trim() : null;
    const roleId = (roleInp.value !== '0') ? parseInt(roleInp.value) : null;
    const url = '/controller/form-action/users-list.php'

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
            if (respData.users.length > 0) {
                const usersTblBody = document.getElementById('users-table-body');

                usersTblBody.innerHTML = '';

                respData.users.forEach(user => {
                    const newElement = document.createElement('tr');
                    const innerHtmlStr = `<td><div class="def-table__row-mark--def"></div></td>
                        <td>${user.name}</td>
                        <td>${user.role}</td>
                        <td>${user.email}</td>
                        <td>
                            <a class="def-table__plus-btn" href="/index.php?view=user&id=${user.key}">+</a>
                        </td>`;
                    
                    newElement.classList.add('def-table__body-row')
                    newElement.innerHTML = innerHtmlStr;
                    usersTblBody.appendChild(newElement);    
                });
            } else {
                alert('No hay usuarios para mostrar');
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
