const filterForm = document.getElementById('filter-form');
const userInp = document.getElementById('user');
const locationInp = document.getElementById('location');

const applyFilters = document.getElementById('apply-flt');
const resetFilters = document.getElementById('reset-flt');

const nowTbody = document.getElementById('now-tbody');

function getMovements() {
    const fran = document.getElementById('fran').value;
    const crtrUser = document.getElementById('user').value.trim();
    const location = document.getElementById('location').value;
    const url = '/controller/form-action/now.php';

    const dataToSend = {
        fran: fran,
        crtrUser: crtrUser ? crtrUser : null,
        location: location === '-1' ? null : parseInt(location),
    };

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
    })
    // .then(response => response.text())
    .then(response => response.json())
    .then(respData => {
        console.log(respData)
    })
    .catch(e => {
        console.error(e);
        alert('Ha ocurrido un error!\nPonete en contacto con el administrador del sistema.');
    })
}

applyFilters.addEventListener('click', getMovements);

resetFilters.addEventListener('click', () => {
    filterForm.reset();
});