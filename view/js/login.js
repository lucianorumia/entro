const loginFrm = document.getElementById('login-frm');
const userInp = document.getElementById('user-inp');
const passInp = document.getElementById('pass-inp');
const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let vldt = formValidate();
    if (vldt) {
        loginRequest();
    }
});

function formValidate() {
    return true;
}

function resetForm() {
    userInp.value = '';
    passInp.value = '';
}

function loginRequest() {
    let sentData = new FormData(loginFrm);

    fetch('../controller/login-rqst_ctrl.php', {
        method: 'POST',
        body: sentData,
    })
    .then(response => response.json())
    .then(respData => {
        if (respData.success) {
            if (respData.loginOk) {
                window.location.href = '/entro/view/movements_view.php';
                // window.location.replace('/entro/view/movements_view.php');
            } else {
                alert('Usuario y/o contraseña incorrectos.');
                resetForm();
            }
        } else {
            const error_msg = respData.error;
            console.log(error_msg);
            alert('Error inesperado.\nPonete en contacto con el administrador del sistema.');
        }
    })
}