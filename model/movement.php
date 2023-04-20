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

    public function selectUsersLastMov($name = null, $mov_type_id = null) {
        $sql = 'SELECT u.id, name, mov_type_id, date_time '
            . 'FROM movements AS m '
            . 'JOIN ('
                . 'SELECT user_id, max(date_time) as date_time '
                . 'FROM movements '
                . 'GROUP BY user_id'
                . ') as sub '
                . 'USING (user_id, date_time) '
            . 'RIGHT JOIN users AS u '
            . 'ON m.user_id = u.id '
            . 'WHERE u.role_id = 2';

        if ($name) {
            $sql .= ' AND name like :name';
        }

        if ($mov_type_id) {
            $sql .= ' AND mov_type_id = 1';
        } elseif (! is_null($mov_type_id)) {
            $sql .= ' AND (mov_type_id = 0 OR mov_type_id is null)';
        }

        $stmt = $this->connection->prepare($sql);

        if ($name) {
            $stmt->bindValue(':name', "%$name%", PDO::PARAM_STR);
        }
        $stmt->execute();
        $resp = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        
        $sql = 'SELECT * '
            . 'FROM movements '
            . 'WHERE user_id = :user_id AND '
            . $where_date
            . ' ORDER BY date_time';

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
