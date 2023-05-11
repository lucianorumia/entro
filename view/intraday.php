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
    <h1 class="title">Movimientos del día</h1>
    <!-- <div class="movements"> -->
    <div class="def-table__container">
HTML;

echo '<table class="def-table">';

if ($movements) {

    $q_movs = count($movements);
    
    foreach ($movements as $i => $movement) {
        $datetime = new DateTime($movement['date_time'], UTC_TIMEZONE);
        $seconds = $datetime->getTimestamp();
        $datetime->setTimezone(DEF_TIMEZONE);

        if ($movement['mov_type_id']) {
            $accum -= $seconds; 
            if ($i === count($movements) - 1) {
                $still_inside = true;
            }
            $css_class = 'def-table__row-mark--entry';
        } else {
            $accum += $seconds; 
            if ($i === 0) {
                $accum -= $datetime_from->getTimestamp();
                echo "<tr>
                        <td><div class='def-table__row-mark def-table__row-mark--start-of-day'></div></td>
                        <td>00:00:00</td>
                    </tr>";
            }
            $css_class = 'def-table__row-mark--exit';
        }

        echo "<tr>\n
                <td><div class='def-table__row-mark $css_class'></div></td>\n
                <td>{$datetime->format('H:i:s')}</td>\n
            </tr>";

        // if ($still_inside) {
        //     $now = new DateTime();
        //     echo "<tr>
        //         <td><div class='def-table__row-mark def-table__row-mark--inside-now'></div></td>
        //         <td id='now-time'>{$now->format('H:i:s')}</td>
        //     </tr>";
        // }
    }
    unset($q_movs);
    
} else {
    if ($movement_ctrl->lastUserMov($_SESSION['user_id'])['state']) {
        $accum -= $datetime_from->getTimestamp();
        $still_inside = true;
        // $now = new DateTime();
        echo "<tr>
                <td><div class='def-table__row-mark def-table__row-mark--start-of-day'></div></td>
                <td>00:00:00</td>
            </tr>";
        // echo "<tr>
        //         <td><div class='def-table__row-mark def-table__row-mark--inside-now'></div></td>
        //         <td id='now-time'>{$now->format('H:i:s')}</td>
        //     </tr>";
        
    } else {
        $no_movs = true;
    }
}

echo "</table>\n";

if ($no_movs ??= false) echo '<div class="pseudo-modal modal--info">
        <div class="modal__header">
            <div class="modal__icon"></div>
            <h3 class="modal__title">Ups!</h3>
        </div>
        <p class="modal__text">Aún no tenés movimientos.</p>
    </div>';

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
