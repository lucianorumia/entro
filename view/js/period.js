const filterForm = document.getElementById('filter-form');
const userInp = document.getElementById('user');
const dateFromInp = document.getElementById('date-from');
const dateToInp = document.getElementById('date-to');
const applyFilters = document.getElementById('apply-flt');
const resetFilters = document.getElementById('reset-flt');

// let applyFiltersFlag = false;
// let resetFiltersFlag = true;

applyFilters.addEventListener('click', getMovements);

resetFilters.addEventListener('click', () => {
    filterForm.reset();
});

function getMovements() {
    const fran = document.getElementById('fran').value;
    const userKey = document.querySelector('#users-list option[value="' + userInp.value + '"]').getAttribute('data-user-key');
    const dateFrom = dateFromInp.value;
    const dateTo = dateToInp.value;
    const url = '/controller/form-action/period.php'

    const dataToSend = {
        fran: fran,
        userKey: userKey,
        dateFrom: dateFrom,
        dateTo: dateTo
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
            if (respData.movements.length > 0) {
                const userPeriodTbody = document.getElementById('user-period-tbody');

                userPeriodTbody.innerHTML = '';

                respData.movements.forEach(movement => {
                    const newElement = document.createElement('tr');
                    let movType = movement.type ? 'def-table__row-mark--entry' : 'def-table__row-mark--exit';
                    const innerHtmlStr = `<td><div class="def-table__row-mark ${movType}"></div></td>
                        <td>${movement.date}</td>
                        <td>${movement.time}</td>
                        <td>
                            <a class="def-table__plus-btn" href="/index.php?view=movement&id=${movement.key}">+</a>
                        </td>`;
                    
                    newElement.classList.add('def-table__body-row')
                    newElement.innerHTML = innerHtmlStr;
                    userPeriodTbody.appendChild(newElement);    
                });
            } else {
                alert('No hay movimientos para mostrar');
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
