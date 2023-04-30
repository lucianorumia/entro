<?php
require 'controller/user.php';
require 'model/connection.php';
require 'model/user.php';

use controller\User as User_ctrl;

$user_ctrl = new User_ctrl;
?>
<h1 class="page-title">Usuarios</h1>
<!-- filter-strip -->
<form class="filter-strip" id="flt-form">
    <div class="filter-strip__filters">
        <label class="filter-strip__element">Nombre
            <input type="text" class="filter-strip__input" id="name" autocomplete="off">
        </label>
        <label class="filter-strip__element">Rol
            <select class="filter-strip__input" id="rol-id">
                <option value="0" selected>Todos</option>
                <?php
                $user_roles = $user_ctrl->getUserRoles();

                foreach($user_roles as $user_role) {
                    $role = ucfirst($user_role['role']);
                    echo "<option value='{$user_role['id']}'>{$role}</option>";
                }
                ?>
            </select>
        </label>
        <input type="hidden" id="fran" value="<?php echo $security->franEncrypt(Views::USERS->value); ?>">
    </div>
    <div class="filter-strip__action-buttons">
        <input type="button" id="apply-flt" class="filter-strip__button" value="Aplicar">
        <input type="button" id="reset-flt" class="filter-strip__button" value="Limpiar">
    </div>
</form>
<div class="def-table__container">
    <table class="def-table" id="users-table">
        <thead>
            <tr>
                <th></th>
                <th id="order-by-name">Nombre</th>
                <th id="order-by-rol">Rol</th>
                <th id="order-by-email">Email</th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
<div class="action-bar">
    <button class="action-bar__button"><a class="spclss--no-effects-font" href="/users/new">Nuevo usuario</a></button>
    <div class="action-bar__circle"></div>
</div>