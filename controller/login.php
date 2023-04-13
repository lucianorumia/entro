<?php
require 'config.php';
require 'security.php';
require 'user.php';
require '../model/connection.php';
require '../model/user.php';

use controller\Security;
use controller\User;

$security = new Security;
$user = new User;

try {
    if (isset($_POST["fran"])) {
        $from = $security->franDecrypt(htmlspecialchars($_POST["fran"]));
        if ($from == View::LOGIN->value) {
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
                header('Location: /index.php?view=' . $rqsted_view); //urlFrndly-> /' . $rqsted_view
                die();
            } else {
                $resp = 'error';
            }
        } else {
            throw new Exception('Invalid Fran key', 2);
        }
    } else {
        throw new Exception('No Fran key', 1);
    }
} catch (Throwable $th) {
    $resp = $th->getMessage();
}
header('Location: /index.php?view=' . View::LOGIN->value . '&resp=' . $resp); //urlFrndly-> /' . View::LOGIN->value . '&resp=' . $resp
