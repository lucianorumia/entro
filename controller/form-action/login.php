<?php
require '../config.php';
require '../security.php';
require '../cstm-exception.php';
require '../user.php';
require '../../model/connection.php';
require '../../model/user.php';

use controller\Security;
use controller\CstmException;
use controller\User;

$security = new Security;
$user = new User;

try {
    if (isset($_POST["fran"])) {
        $from = $security->franDecrypt(htmlspecialchars($_POST["fran"]));

        if ($from == Views::LOGIN->value) {
            $name = htmlspecialchars($_POST["name"]);
            $pass = htmlspecialchars($_POST["pass"]);
            $match = $user->loginDataMatch($name, $pass);

            if ($match) {
                session_start();
                $_SESSION["user_id"] = $match["user_id"];
                $_SESSION["user_name"] = $name;
                $_SESSION["role_id"] = $match["role_id"];

                switch ($match['role_id']) {
                    case 1:
                        $rqsted_view = ADM_DEF_VIEW->value;
                        break;
                    case 2:
                        $rqsted_view = EMP_DEF_VIEW->value;
                        break;
                }

                $resp['success'] = true;
                $resp['location'] = "/$rqsted_view";
            } else {
                throw new CstmException(CstmExceptions::WRONG_LOGIN_DATA->msg(), CstmExceptions::WRONG_LOGIN_DATA->value);
            }
        } else {
            throw new CstmException(CstmExceptions::INVALID_FRAN->msg(), CstmExceptions::INVALID_FRAN->value);
        }
    } else {
        throw new CstmException(CstmExceptions::NO_FRAN->msg(), CstmExceptions::NO_FRAN->value);
    }
} catch (CstmException $e) {
    $resp['success'] = false;
    $resp['error'] = "CST{$e->getCode()}";
} catch (Throwable $th) {
    $resp['success'] = false;
    $resp['error'] = $th->getMessage() . $th->getFile() . $th->getLine();
}

//header("Content-Type: application/json; charset=UTF-8");
echo $json_resp = json_encode($resp);