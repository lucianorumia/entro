<?php
require 'controller/movement.php';
require 'model/connection.php';
require 'model/movement.php';

?>
<h1 class="page-title">Dentro/fuera</h1>
<!-- filter-strip -->
<form class="filter-strip" id="flt-form">
    <div class="filter-strip__filters">
        <div class="filter-strip__element">
            <label class="filter-strip__label" for="user">Nombre</label>
            <input class="filter-strip__input" id="user" type="text" autocomplete="off">
        </div>
        <div class="filter-strip__element">
            <label class="filter-strip__label" for="location">Lugar</label>
            <select class="filter-strip__input" id="location">
                <option value="-1" selected>Todos</option>
                <option value="1">Dentro</option>
                <option value="0">Fuera</option>
            </select>
        </div>
        <input type="hidden" id="fran" value="<?php echo $security->franEncrypt(View::NOW->value); ?>">
    </div>
    <div class="filter-strip__action-buttons">
        <input type="button" id="apply-flt" class="filter-strip__button" value="Aplicar">
        <input type="button" id="reset-flt" class="filter-strip__button" value="Limpiar">
    </div>
</form>
<div class="def-table__container">
    <table class="def-table">
        <thead>
            <tr>
                <th></th>
                <th class="def-table__order-by" id="order-by-name">Usuario</th>
                <th class="def-table__order-by" id="order-by-rol">Entrada/Salida</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="now-table-body"></tbody>
    </table>
</div>