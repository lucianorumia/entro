const CST_ERROR = Object.freeze({
    CST1001: {
        code: 'CST1001',
        modal: {
            title: 'Error de login',
            text: 'Usuiario y/o contraseña incorrectos.<br>Volvé a intentarlo.',
        },
    },

    CST099: {
        code: 'CST099',
        modal: {
            title: 'Error',
            text: 'Ha ocurrido un error.<br>Ponete en contacto con el administrador del sistema.',
        },
    },
})

export {
    CST_ERROR,
}
