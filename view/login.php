<?php
// if (isset($_GET["resp"])) {
//     echo "<p>{$_GET['resp']}</p>";
// }
$from = View::LOGIN->value;
$fran = $security->franEncrypt($from);
?>
<form id="login-frm" method="post" action="/controller/login.php">
    <input type="hidden" name="fran" id="fran" value="<?php echo $fran; ?>">
    <label class="login-form__label" for="user-inp">Usuario</label>
    <input class="login-form__input" type="text" id="user-inp" name="name" autocomplete="off">
    <label class="login-form__label" for="pass-inp">Contraseña</label>
    <input class="login-form__input" type="password" id="pass-inp" name="pass">
    <input class="login-form__button" type="submit" id="login-btn" value="Ingresar">
</form>
