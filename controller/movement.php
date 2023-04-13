<?php
namespace controller;

use model\Movement as Movement_mdl;

class Movement {
    
    public function lastUserMov($user_id): array {
        $movement_mdl = new Movement_mdl;
        $row = $movement_mdl->selectLastMovByUserId($user_id);

        if ($row) {
            $resp = [
                'state' => (bool) $row['mov_type_id'],
                'datetime' => $row['date_time']
            ];
        } else {
            $resp = [
                'state' => false,
                'datetime' => null
            ];
        }

        return $resp;
    }

    public function insertMovement($user_id, $mov_type_id, $date_time): bool {
        $movement_mdl = new Movement_mdl;
        $resp = $movement_mdl->insertMov($user_id, $mov_type_id, $date_time);

        return $resp;
    }

    public function getUserMovements($user_id, $datetime_from, $datetime_to = null): array {
        $movement_mdl = new Movement_mdl;
        $resp = $movement_mdl->selectMovementsByUser($user_id, $datetime_from, $datetime_to);

        return $resp;
    }
}