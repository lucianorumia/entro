<?php
require '../config.php';
require '../security.php';
require '../user.php';
require '../../model/connection.php';
require '../../model/user.php';

use controller\Security;
use controller\User;

$security = new Security;
$user = new User;

$resp = [];

try {
    $json_rqst = file_get_contents('php://input');
    $rqst = json_decode($json_rqst, true);

    $from = $security->franDecrypt($rqst['fran']);

    if ($from === View::USERS->value) {
        $name = $rqst['name'];
        $role_id = $rqst['roleId'];

        $rows = $user->getUsers($name, $role_id);

        $users = [];
        foreach ($rows as $index => $row) {
            $users[$index] = [
                'key' => $security->aideEncrypt($row['id']),
                'name' => $row['name'],
                'role' => ucfirst($row['role']),
                'email' => $row['email'],
            ];
        }

        $resp['success'] = true;
        $resp['users'] = $users;
    } else {
        throw new Exception(CstmException::INVALID_FRAN->msg(), CstmException::INVALID_FRAN->value);
    }

} catch (Exception $ex) {
    $resp['success'] = false;
    $resp['errorCode'] = $ex->getCode();
    $resp['errorMsg'] = $ex->getMessage();
}

//header("Content-Type: application/json; charset=UTF-8");
echo $json_resp = json_encode($resp);
