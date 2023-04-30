<?php
namespace model;

// Global namespaces
use \PDO;
use USER_ROLE;

class User extends Connection {

    public function __construct() {
        parent::__construct();
    }
    
    public function selectUserById($id) {
        $sql = "SELECT * " // id, name, pass, email, role_id
                . "FROM users "
                . "WHERE id = :id";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        return $res;
    }

    public function selectUserByName($name) {
        $sql = "SELECT id, pass, email, role_id 
            FROM users 
            WHERE name = :name";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(":name", $name, PDO::PARAM_STR);
        $stmt->execute();
        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        return $res;
    }

    public function selectUsers($name = null, $role_id = null){
        $set_param = [];
        $where_str = ' WHERE';

        if (isset($name)) {
            $set_param[] = 'name';
            $where_str .= " name LIKE :name";
        }

        if (isset($role_id)) {
            $set_param[] = 'role';
            $operator = (count($set_param) > 1) ? ' AND' : '';
            $where_str .= "$operator role_id = :role_id";
        }
        
        $sql = 'SELECT u.id, name, email, role '
                . 'FROM users AS u '
                . 'JOIN usr_roles AS r '
                . 'ON u.role_id = r.id';
        $sql .= empty($set_param) ? '' : $where_str;

        $stmt = $this->connection->prepare($sql);

        if (in_array('name', $set_param)) {
            $stmt->bindValue(':name', "%$name%", PDO::PARAM_STR);
        }
        if (in_array('role', $set_param)) {
            $stmt->bindValue(':role_id', $role_id, PDO::PARAM_INT);
        }

        $stmt->execute();
        $resp = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $resp;
    }

    public function selectEmployees(): array|false {
        $sql = 'SELECT id, name '
            . 'FROM users '
            . 'WHERE role_id = ' . USER_ROLE::EMPLOYEE->value;
        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $resp = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $resp;
    }

    public function insertUser ($name, $pass, $email, $role_id) {
        $sql = 'INSERT INTO users (name, pass, email, role_id) '
                . 'VALUES (:name, :pass, :email, :role_id)';
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':pass', $pass, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':role_id', $role_id, PDO::PARAM_INT);
        $resp = $stmt->execute();

        return $resp;
    }

    public function updateUser($id, $usuario, $mail, $rol_id, $clave) {
        $sub_sql = "";
        $rnv_clave = !is_null($clave);
        If ($rnv_clave) {
            $hash_pass = password_hash($clave, PASSWORD_DEFAULT);
            $sub_sql = ", clave = :clave ";
        }

        $sql = "UPDATE usuarios "
                . "SET usuario = :usuario, "
                . "mail = :mail, "
                . "rol_id = :rol_id
                $sub_sql
                WHERE id = :id";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(":usuario", $usuario, PDO::PARAM_STR);
        $stmt->bindParam(":mail", $mail, PDO::PARAM_STR);
        $stmt->bindParam(":rol_id", $rol_id, PDO::PARAM_INT);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        If ($rnv_clave) {
            $stmt->bindParam(":clave", $hash_pass, PDO::PARAM_STR);
        }
        $res = $stmt->execute();

        if ($res) {
            return true;  
        } else {
            return false;
        }
    }

    public function deleteUser($id) {
        $sql = 'DELETE FROM users '
                . 'WHERE id = :id';
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $resp = $stmt->execute();

        return $resp;
    }

    public function selectUserRoles () {
        $sql = "SELECT * "
            . "FROM usr_roles;";
        $stmt = $this->connection->prepare($sql);
        $stmt->execute();
        $resp = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        return $resp;
    }
}
