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

try {
    if (isset($_POST['fran'])) {
        $from = $security->franDecrypt($_POST['fran']);
        if ($from == Views::USERS->value) {
            $name = htmlspecialchars($_POST['name']);
            $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
            if (! $email) throw new Exception(CstmExceptions::INPUT_VALIDATE_ERROR->msg() . ' - Line: ' . __LINE__, CstmExceptions::INPUT_VALIDATE_ERROR->value);
            $pass = htmlspecialchars($_POST['pass']);
            $role_id = filter_var((int) $_POST['role-id'], FILTER_VALIDATE_INT);
            if (! $role_id) throw new Exception(CstmExceptions::INPUT_VALIDATE_ERROR->msg() . ' - Line: ' . __LINE__, CstmExceptions::INPUT_VALIDATE_ERROR->value);
            
            $exct = $user->createUser($name, $pass, $email, $role_id);
            if ($exct) {
                header('Location: /' . Views::USERS->value . '?from=new&succ=true');
                die();
            } else {
                $resp = 'error';
            }
        } else {
            throw new Exception('Invalid Fran key', 2);
        }
    } else {
        throw new Exception(CstmExceptions::NO_FRAN->msg(), CstmExceptions::NO_FRAN->value);
    }
} catch (Throwable $th) {
    $resp = $th->getMessage();
}
header('Location: /' . Views::USERS->value . '?from=new&succ=false&error=' . $resp);
