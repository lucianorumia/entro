<?php
namespace model;

//Global namespaces
use \PDO;

class Movement extends Connection {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function selectLastMovByUserId($user_id): array|false {
        $sql = 'SELECT id, mov_type_id, date_time
            FROM movements
            WHERE user_id = :user_id
            ORDER BY date_time DESC
            LIMIT 1';
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $resp = $stmt->fetch(PDO::FETCH_ASSOC);

        return $resp;
    }

    public function insertMov($user_id, $mov_type_id, $date_time) :bool {
        $sql = 'INSERT INTO movements (user_id, mov_type_id, date_time) '
            . 'VALUES (:user_id, :mov_type_id, :date_time)';
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':mov_type_id', $mov_type_id, PDO::PARAM_INT);
        $stmt->bindParam(':date_time', $date_time, PDO::PARAM_STR);
        $resp = $stmt->execute();
        
        return $resp;
    }

    public function selectMovementsByUser($user_id, $datetime_from, $datetime_to): array {
        
        if($datetime_to) {
            $where_date = "date_time BETWEEN :from AND :to";
        } else {
            $where_date = "date_time >= :from";
        }
        
        $sql = "SELECT * 
            FROM movements
            WHERE user_id = :user_id AND " . $where_date;

        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":from", $datetime_from, PDO::PARAM_STR);
        if($datetime_to) {
            $stmt->bindParam(":to", $datetime_to, PDO::PARAM_STR);
        }

        $stmt->execute();
        $resp = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $resp;
    }
}
