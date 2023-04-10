<?php
namespace model;

// Global namespaces
use \PDO;
use \Exception;

class Connection {
    
    protected $connection;

    public function __construct(){
        try {
            $this->connection = new PDO('mysql:host=' . DB_HOST . '; dbname=' . DB_NAME, DB_USER, DB_PASS);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->exec('SET CHARACTER SET ' . DB_CHARSET);
        } catch (Exception $ex) {
            die('Error: ' . $ex->getMessage() . ' (File: ' . $ex->getFile() . '; Line: ' . $ex->getLine() . ')');
        }
    }
}
