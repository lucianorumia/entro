<?php
namespace controller;

use controller\Security;
use model\User as User_mdl;

class User {
    public function loginDataMatch($name, $pass): array|false {
        $user_mdl = new User_mdl;
        $user_match = $user_mdl->selectUserByName($name);

        if($user_match){
            $hash_pass = $user_match['pass'];
            $pass_match = password_verify($pass, $hash_pass);
            if ($pass_match) {
                return [
                    "user_id" => $user_match["id"],
                    "role_id" => $user_match['role_id']
                ];
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    public function passVerify($user_id, $pass): bool {
        $user_mdl = new User_mdl;
        $user_data = $user_mdl->selectUserById($user_id);
        $hash_pass = $user_data["pass"];
        $res = password_verify($pass, $hash_pass);

        return $res;
    }
    
    public function getUsers($name = null, $role_id = null) {
        $user_mdl = new User_mdl;
        $resp = $user_mdl->selectUsers($name, $role_id);

        return $resp;
    }

    public function getEmployees(): array|false {
        $security = new Security;
        $user_mdl = new User_mdl;
        $rows = $user_mdl->selectEmployees();
        
        if ($rows) {
            $resp = [];
            foreach ($rows as $i => $row) {
                $resp[$i] = [
                    'key' => $security->aideEncrypt($row['id']),
                    'name' => $row['name']
                ];
            }
        } else {
            $resp = false;
        }

        return $resp;
    }

    public function getUserById($id) {
        $user_mdl = new User_mdl;
        $resp = $user_mdl->selectUserById($id);

        return $resp;
    }

    public function getUserRoles() {
        $user_mdl = new User_mdl;
        $resp = $user_mdl->selectUserRoles();
        
        return $resp;
    }

    public function createUser($name, $pass, $email, $role_id) {
        $user_mdl = new User_mdl;
        $hash_pass = password_hash($pass, PASSWORD_DEFAULT);
        $resp = $user_mdl->insertUser($name, $hash_pass, $email, $role_id);
        
        return $resp;
    }

    public function deleteUser($id) {
        $user_mdl = new User_mdl;
        $resp = $user_mdl->deleteUser($id);
        
        return $resp;
    }
}