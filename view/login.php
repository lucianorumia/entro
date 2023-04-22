<form id="login-frm" method="post">
    <label class="login-form__label" for="user-inp">Usuario</label>
    <input class="login-form__input" type="text" id="user-inp" name="name" autocomplete="off">
    <label class="login-form__label" for="pass-inp">Contraseña</label>
    <input class="login-form__input" type="password" id="pass-inp" name="pass">
    <input class="login-form__button" type="submit" id="login-submit" value="Ingresar">
    <input type="hidden" name="fran" id="fran" value="<?php echo $security->franEncrypt(Views::LOGIN->value); ?>">
</form>
