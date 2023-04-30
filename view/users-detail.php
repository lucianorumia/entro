<?php
require 'controller/user.php';
require 'model/connection.php';
require 'model/user.php';

use controller\User as User_ctrl;

$user_ctrl = new User_ctrl;
$user_id = $security->aideDecrypt($url_id); //pndt add error handler
$user_data = $user_ctrl->getUserById($user_id); //pndt add error handler
?>
<h1 class='page-title'>Usuario</h1>
<div class="def-form__container">
    <form class="def-form" id="user-form" method="post">
        <label class="def-form__label" for="name">Nombre</label>
        <input class="def-form__input" id="name" name="name" type="text" autocomplete="off" value="<?php echo "{$user_data['name']}"; ?>" disabled>
        <label class="def-form__label" for="email">Email</label>
        <input class="def-form__input" id="email" name="email" type="email" autocomplete="off" value="<?php echo "{$user_data['email']}"; ?>" disabled>
        <label class="def-form__label" for="role-id">Rol</label>
        <select class="def-form__input" id="role-id" name="role-id" disabled>
            <?php
            $user_roles = $user_ctrl->getUserRoles();

            foreach($user_roles as $user_role) {
                $role = ucfirst($user_role['role']);
                echo "<option value='{$user_role['id']}'";
                echo $user_role['id'] == $user_data['role_id'] ? ' selected' : '';
                echo ">{$role}</option>";
            }
            ?>
        </select>
        <input type="hidden" id="fran" name="fran" value="<?php echo $security->franEncrypt(Views::USERS->value); ?>">
        <input type="hidden" id="aide" name="aide" value="<?php echo $url_id; ?>">
    </form>
</div>
<div class="action-bar">
    <button class="action-bar__button" id="back-btn">Volver</button>
    <button class="action-bar__button" id="update-btn">Editar</button>
    <button class="action-bar__button" id="delete-btn">Eliminar</button>
    <div class="action-bar__circle"></div>
</div>    
