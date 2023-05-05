<?php
require 'controller/movement.php';
require 'model/connection.php';
require 'model/movement.php';

use controller\Movement as Movement_ctrl;

$movement_ctrl = new Movement_ctrl;

?>
<h1 class="page-title">Período</h1>
<!-- filter-strip -->
<form class="filter-strip" id="filter-form">
    <div class="filter-strip__filters">
        <div class="filter-strip__element">
            <label class="filter-strip__label">Desde</label>
            <input class="filter-strip__input" id="date-from" type="date" value="<?php
                $date = new DateTime();
                $today = $date->format('Y-m-d');
                $interval = new DateInterval('P1M');
                $date->sub($interval);
                echo $date->format('Y-m-d');
            ?>">
            <p class="vldt__caption"></p>
        </div>
        <div class="filter-strip__element">
            <label class="filter-strip__label">Hasta</label>
            <input class="filter-strip__input" id="date-to" type="date" value="<?php echo $today; ?>" max="<?php echo $today; ?>">
            <p class="vldt__caption"></p>
        </div>
        <input type="hidden" id="fran" value="<?php echo $security->franEncrypt(Views::ME_PERIOD->value); ?>">
        <input type="hidden" id="user-key" value="<?php echo $security->aideEncrypt($_SESSION['user_id']); ?>">
    </div>
    <div class="filter-strip__action-buttons">
        <input type="button" id="apply-flt" class="filter-strip__button" value="Aplicar">
        <input type="button" id="reset-flt" class="filter-strip__button" value="Limpiar">
    </div>
</form>
<div class="def-table__container">
    <table class="def-table" id="user-period-table">
        <thead>
            <tr>
                <th></th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Parcial</th>
                <th>Hs. Acum.</th>
                <!-- <th></th> -->
            </tr>
        </thead>
        <tbody id="user-period-tbody"></tbody>
    </table>
</div>
<!-- <div class="action-bar">
    <button class="action-bar__button">Exportar</button>
    <div class="action-bar__circle"></div>
</div> -->
