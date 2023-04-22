<?php
require 'controller/user.php';
require 'model/connection.php';
require 'model/user.php';

use controller\User as User_ctrl;

$user_ctrl = new User_ctrl;
$get_id = $_GET['id'] ?? null;
$get_act = $_GET['act'] ?? null;

// View role
if ($get_id) {
    $view_role = ViewRole::DETAIL;
} else {
    $view_role = ViewRole::CREATE;
}

// Set page title
switch ($view_role) {
    case ViewRole::CREATE:
        $page_title = 'Nuevo usuario';
        break;
    
    default:
        $page_title = 'Usuario';
        break;
}

echo "<h1 class='page-title'>{$page_title}</h1>";

// Inputs values
if ($view_role === ViewRole::DETAIL) {
    $user_id = $security->aideDecrypt($get_id); //pndt add error handler
    $user_data = $user_ctrl->getUserById($user_id); //pndt add error handler
} 

?>
<div class="def-form__container">
    <form class="def-form" id="user-form" method="post">
        <label class="def-form__label" for="name">Nombre</label>
        <input class="def-form__field" id="name" name="name" type="text" autocomplete="off"<?php
            echo $view_role === ViewRole::DETAIL ? " value='{$user_data['name']}' disabled" : '';
        ?>>
        <label class="def-form__label" for="email">Email</label>
        <input class="def-form__field" id="email" name="email" type="email" autocomplete="off"<?php
            echo $view_role === ViewRole::DETAIL ? " value='{$user_data['email']}' disabled" : '';
        ?>>
        <?php
        if ($view_role === ViewRole::CREATE || $view_role === ViewRole::UPDATE):
        ?>
        <label class="def-form__label" for="pass">Contraseña</label>
        <input class="def-form__field" id="pass" name="pass" type="password" autocomplete="off">
        <label class="def-form__label" for="match-pass">Confirmá la contraseña</label>
        <input class="def-form__field" id="match-pass" type="password" autocomplete="off">
        <?php
        endif
        ?>
        <label class="def-form__label" for="role-id">Rol</label>
        <select class="def-form__field" id="role-id" name="role-id"<?php
            echo $view_role === ViewRole::DETAIL ? ' disabled' : '';
        ?>>
            <?php
            $user_roles = $user_ctrl->getUserRoles();

            foreach($user_roles as $user_role) {
                $role = ucfirst($user_role['role']);
                echo "<option value='{$user_role['id']}'";
                if ($view_role === ViewRole::CREATE) {
                    echo $user_role['id'] == 2 ? ' selected' : '';
                } else {
                    echo $user_role['id'] == $user_data['role_id'] ? ' selected' : '';
                }
                echo ">{$role}</option>";
            }
            ?>
        </select>
        <input type="hidden" id="fran" name="fran" value="<?php echo $security->franEncrypt(Views::USER->value); ?>">
        <input type="hidden" id="aide" name="aide" value="<?php echo $get_id; ?>">
    </form>
</div>
<div class="action-bar">
    <?php
    if ($view_role === ViewRole::DETAIL):
    ?>
        <button class="action-bar__button" id="back-btn">Volver</button>
        <button class="action-bar__button" id="update-btn">Editar</button>
        <button class="action-bar__button" id="delete-btn">Eliminar</button>
    <?php
    else: //ViewRole::CREATE
    ?>
        <button class="action-bar__button" id="cancel-btn">Cancelar</button>
        <button class="action-bar__button" type="reset" form="user-form">Limpiar</button>
        <button class="action-bar__button" id="save-btn">Guardar</button>
    <?php
    endif;
    ?>
    <div class="action-bar__circle"></div>
</div>    
<?php
// Set JS files

switch ($view_role) {
    case ViewRole::CREATE:
        $js_file_path = '/view/js/user-create.js';
        break;
    case ViewRole::DETAIL:
        $js_file_path = '/view/js/user-detail.js';
        break;
}

echo "<script defer type='module' src='{$js_file_path}'></script>";
