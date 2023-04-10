<?php
require 'controller/movement.php';
require 'model/connection.php';
require 'model/movement.php';

?>
<h1 class="page-title">Adentro/afuera</h1>

<table>
    <thead>
        <tr>
            <th></th>
            <th><a class="def-table__order-by" href="">Usuario</a></th>
            <th><a class="def-table__order-by" href="">Entrada/Salida</a></th>
        </tr>
    </thead>
    <tbody id="now-table-body"></tbody>
</table>