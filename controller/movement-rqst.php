<?php
require 'config.php';
require 'security.php';
require 'movement.php';
require 'user.php';
require '../model/connection.php';
require '../model/movement.php';
require '../model/user.php';

use controller\Security;
use controller\Movement;
use controller\User;

$security = new Security;
$user = new User;
$movement = new Movement;

try {
    // Receiving request JSON
    $rqst_json = file_get_contents('php://input');
    $rqst_obj = json_decode($rqst_json);

    // $from = $security->franDecrypt(htmlspecialchars($rqst_obj -> fran));
    $from = $security->franDecrypt($rqst_obj -> fran); //temp

    $resp_obj = new stdClass();

    switch ($from) {
        case View::MOVEMENT->value:
            $user_id = $security->aideDecrypt($rqst_obj->userKey);
            
            // Pass verify
            $pass = htmlspecialchars($rqst_obj->pass);
            $pass_verify = $user->passVerify($user_id, $pass);

            if ($pass_verify) {
                $mov_type_id = (int) filter_var($rqst_obj->movTypeId,FILTER_VALIDATE_BOOL);
                $date_time = new DateTime($rqst_obj->dateTime); //filtar input
                $formatted_date_time = $date_time->format("Y-m-d H:i:s");

                // Insert Movement
                $resp_obj->success = $movement->insertMovement($user_id, $mov_type_id, $formatted_date_time);
            } else {
                throw new Exception('invalid pass', 3);
            }
            break;

        default:
            throw new Exception("invalid fran", 2);
            break;
    }

} catch (Throwable $th) {
    $resp_obj->success = false;
    $resp_obj->errorCode = $th->getCode();
    $resp_obj->errorMsg = $th->getMessage();
}

$json_resp = json_encode($resp_obj);
echo $json_resp;