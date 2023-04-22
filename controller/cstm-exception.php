<?php
namespace controller;

// Global namespaces
use \Throwable;
use \Exception;

class CstmException extends Exception {
    public function __construct($message, $code, Throwable $previous = null) {
        parent::__construct($message, $code, $previous);
    }
}