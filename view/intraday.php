<?php
require 'controller/movement.php';
require 'model/connection.php';
require 'model/movement.php';

use controller\Movement as Movement_ctrl;

$movement_ctrl = new Movement_ctrl;

$accum = 0; 
$still_inside = false;
$datetime_from = new DateTime();
$datetime_from->setTime(0, 0, 0);
$datetime_from->setTimezone(UTC_TIMEZONE);

$movements = $movement_ctrl->getUserMovements($_SESSION['user_id'], $datetime_from->format('Y-m-d H:i:s'));

echo <<<HTML
    <p class="movements__title">Movimientos del día</p>
    <div class="movements">
HTML;

if ($movements) {

    echo '<table class="movs-table">';

    $q_movs = count($movements);
    
    foreach ($movements as $i => $movement) {
        $datetime = new DateTime($movement['date_time'], UTC_TIMEZONE);
        $seconds = $datetime->getTimestamp();
        $datetime->setTimezone(DEF_TIMEZONE);

        if ($movement['mov_type_id']) {
            $accum -= $seconds; 
            if ($i === count($movements) - 1) $still_inside = true;
            $css_class = 'movs-table__row--entry';
        } else {
            $accum += $seconds; 
            if ($i === 0) $accum -= $datetime_from->getTimestamp();
            $css_class = 'movs-table__row--exit';
        }

        echo "<tr><td class='movs-table__row $css_class'>{$datetime->format('H:i:s')}</td></tr>";
    }
    unset($q_movs);
    
    echo '</table>';
} else {
    $html_str = '<p class="movements__message">Aún no tenés movimientos para mostrar.';
    if ($movement_ctrl->lastUserMov($_SESSION['user_id'])['state']) {
        $accum -= $datetime_from->getTimestamp();
        $still_inside = true;
        $html_str .= '<br/><br/>Aunque cuando empezó el día ya estabas trabajando.';
    }
    $html_str .= '</p>';
    
    echo "$html_str";
}

echo '</div>';

if ($still_inside) {
    $js_aux_accum = $accum;
    $now = new DateTime();
    $accum += $now->getTimestamp();
} else {
    $js_aux_accum = 'false';
}

$accum_his = seconds2His($accum);
$accum_str = "{$accum_his['H']}:{$accum_his['i']}:{$accum_his['s']}";

echo <<<HTML
    <div class="accum">
        <p class="accum__label">Acumulado:</p>
        <p class="accum__data">{$accum_str}</p>
    </div>
    <script>
        const accumSeconds = {$js_aux_accum};
    </script>
HTML;
