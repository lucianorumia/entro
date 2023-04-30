<?php
switch ($url_id) {
    case '403':
        $error_desc = 'Acceso denegado:<br>'
            . 'el usuario no tiene los permisos para acceder a la p&aacute;gina solicitada.';
        break;
    case '404':
        $error_desc = 'La página que solicitaste no existe o no podemos encontrarla.<br>'
            . 'Cheque&aacute; la dirección que ingresaste o usá los links para navegar.';
        break;
    case '825':
        $error_desc = 'El usuario ya tiene una sesión activa.';
        break;
    default:
        $error_desc = 'Parece que ha ocurrido un error.<br>'
            . 'Ponete en contacto con el administrador del sistema.';
        break;
}

echo <<<HTML
    <h1 class="page-title">Ups!</h1>
    <p class="error-description">$error_desc<p>
    <div class="action-bar">
        <button class="action-bar__button" id="back-btn">Volver</button>
        <div class="action-bar__circle"></div>
    </div>
HTML;
?>