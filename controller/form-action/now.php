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

    if ($from === Views::NOW->value) {
        if(is_null($rqst['crtrUser'])) {
            $crtr_user = null;
        } else {
            $crtr_user = htmlspecialchars($rqst['crtrUser']);
        }

        if(is_null($rqst['location'])) {
            $location = null;
        } else {
            $location = filter_var($rqst['location'], FILTER_VALIDATE_INT, ['Options' => ['min_range' => 0, 'max_range' => 1]]);
            if ($location === false) throw new Exception(CstmExceptions::INPUT_VALIDATE_ERROR->msg() . ' - Line: ' . __LINE__, CstmExceptions::INPUT_VALIDATE_ERROR->value);
        }

        $rows = $movement_ctrl->getUsersLastMovement($crtr_user, $location);

        $movements = [];
        foreach ($rows as $index => $row) {
            if (is_null($row['mov_type_id'])) {
                $location = 0;
            } else {
                $location = $row['mov_type_id'];
            }
            
            if (is_null($row['date_time'])) {
                $formatted_datetime = null;
            } else {
                $datetime = new DateTime($row['date_time'], UTC_TIMEZONE);
                $datetime->setTimezone(DEF_TIMEZONE);
                $formatted_datetime = $datetime->format('c');
            }

            $movements[$index] = [
                'user' => $row['name'],
                'location' => $location,
                'datetime' => $formatted_datetime,
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