<?php
require 'controller/user.php';
require 'model/connection.php';
require 'model/user.php';

use controller\User as User_ctrl;

$user_ctrl = new User_ctrl;
?>
<h1 class='page-title'>Nuevo usuario</h1>
<div class="def-form__container">
    <form class="def-form" id="user-form" method="post">
        <div class="def-form__field">
            <label class="def-form__label" for="name">Nombre</label>
            <input class="def-form__input" id="name" name="name" type="text" autocomplete="off">
            <p class="vldt__caption"></p>
        </div>
        <div class="def-form__field">   
            <label class="def-form__label" for="email">Email</label>
            <input class="def-form__input" id="email" name="email" type="email" autocomplete="off">
            <p class="vldt__caption"></p>
        </div>
        <div class="def-form__field">
            <label class="def-form__label" for="pass">Contraseña</label>
            <input class="def-form__input" id="pass" name="pass" type="password" autocomplete="off">
            <p class="vldt__caption"></p>
        </div>
        <div class="def-form__field">
            <label class="def-form__label" for="match-pass">Confirmá la contraseña</label>
            <input class="def-form__input" id="match-pass" type="password" autocomplete="off">
            <p class="vldt__caption"></p>
        </div>
        <div class="def-form__field">
            <label class="def-form__label" for="role-id">Rol</label>
            <select class="def-form__input" id="role-id" name="role-id">
                <?php
                $user_roles = $user_ctrl->getUserRoles();

                foreach($user_roles as $user_role) {
                    $role = ucfirst($user_role['role']);
                    echo "<option value='{$user_role['id']}'";
                    echo $user_role['id'] == 2 ? ' selected' : '';
                    echo ">{$role}</option>";
                }
                ?>
            </select>
        </div>
        <input type="hidden" id="fran" name="fran" value="<?php echo $security->franEncrypt(Views::USERS->value); ?>">
    </form>
</div>
<div class="action-bar">
    <button class="action-bar__button" id="cancel-btn">Cancelar</button>
    <button class="action-bar__button" id="reset-btn" type="reset" form="user-form">Limpiar</button>
    <button class="action-bar__button" id="save-btn">Guardar</button>
    <div class="action-bar__circle"></div>
</div>    
