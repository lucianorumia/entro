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
        if ($from == Views::USER->value) {
            $id = $security->aideDecrypt(htmlspecialchars($_POST['aide']));
            if (! $id) throw new Exception(CstmExceptions::INVALID_AIDE->msg() . ' - Line: ' . __LINE__, CstmExceptions::INVALID_AIDE->value);
            
            $exct = $user->deleteUser($id);
            if ($exct) {
                header('Location: /index.php?view=' . Views::USERS->value . '&succ=true&from=create');
                die();
            } else {
                $resp = 'error';
            }
        } else {
            throw new Exception(CstmExceptions::INVALID_FRAN->msg(), CstmExceptions::INVALID_FRAN->value);
        }
    } else {
        throw new Exception(CstmExceptions::NO_FRAN->msg(), CstmExceptions::NO_FRAN->value);
    }
} catch (Throwable $th) {
    $resp = $th->getMessage();
}
header('Location: /index.php?view=' . Views::USERS->value . '&succ=false&from=create&error=' . $resp);
