<?php
require '../config.php';
require '../security.php';
require '../movement.php';
require '../../model/connection.php';
require '../../model/movement.php';

use controller\Security;
use controller\Movement as Movement_ctrl;

$security = new Security;
$movement_ctrl = new Movement_ctrl;

$resp = [];

try {
    $json_rqst = file_get_contents('php://input');
    $rqst = json_decode($json_rqst, true);

    $from = $security->franDecrypt($rqst['fran']);

    if ($from === Views::ME_PERIOD->value) {
        $user_id = $security->aideDecrypt($rqst['userKey']);
        $datetime_from = new DateTime($rqst['dateFrom']);
        $datetime_from->setTimezone(UTC_TIMEZONE);
        $datetime_to = new DateTime($rqst['dateTo']);
        $datetime_to->add(new DateInterval('P1D'));
        $datetime_to->setTimezone(UTC_TIMEZONE);
        
        $rows = $movement_ctrl->getUserMovements($user_id, $datetime_from->format('Y-m-d H:i:s'), $datetime_to->format('Y-m-d H:i:s'));

        $movements = [];
        foreach ($rows as $index => $row) {
            $datetime = new DateTime($row['date_time'], UTC_TIMEZONE);
            $datetime->setTimezone(DEF_TIMEZONE);
            $formated_datetime = $datetime->format('c');

            $movements[$index] = [
                'key' => $security->aideEncrypt($row['id']),
                'type' => $row['mov_type_id'],
                'datetime' => $formated_datetime,
            ];
        }

        $resp['success'] = true;
        $resp['movements'] = $movements;
    } else {
        throw new Exception(CstmExceptions::INVALID_FRAN->msg(), CstmExceptions::INVALID_FRAN->value);
    }

} catch (Exception $ex) {
    $resp['success'] = false;
    $resp['errorCode'] = $ex->getCode();
    $resp['errorMsg'] = $ex->getMessage();
}

//header("Content-Type: application/json; charset=UTF-8");
echo $json_resp = json_encode($resp);