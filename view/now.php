<?php
require 'controller/movement.php';
require 'model/connection.php';
require 'model/movement.php';

?>
<h1 class="page-title">Dentro/fuera</h1>
<!-- filter-strip -->
<form class="filter-strip" id="filter-form">
    <div class="filter-strip__filters">
        <div class="filter-strip__element sprclss--display-none">
            <label class="filter-strip__label" for="user">Empleado</label>
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
        <input type="hidden" id="fran" value="<?php echo $security->franEncrypt(Views::NOW->value); ?>">
    </div>
    <div class="filter-strip__action-buttons">
        <input type="button" id="apply-flt" class="filter-strip__button" value="Aplicar">
        <input type="button" id="reset-flt" class="filter-strip__button" value="Limpiar">
    </div>
</form>
<div class="def-table__container">
    <table class="def-table" id="now-table">
        <thead>
            <tr>
                <th></th>
                <th class="def-table__order-by" id="order-by-name">Empleado</th>
                <!-- <th>Estado</th> -->
                <th class="def-table__order-by" id="order-by-datetime">Último movimiento</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>