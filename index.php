<?php
require "controller/config.php";
require "controller/security.php";

session_start();
if (isset($_SESSION["user_id"])) {
    $logged_in = true;
    if (isset($_GET["view"])){
        $rqsted_view = $_GET["view"];
        // falta filtrar: si la vista es 'login' o si es una vista no autorizada para el rol
    } elseif ($_SESSION["role_id"] == 1) {
        $rqsted_view = ADM_DEF_VIEW->value;
    } else {
        $rqsted_view = EMP_DEF_VIEW->value;
    }
} else {
    $logged_in = false;
    $rqsted_view = View::LOGIN->value;
}   

$security = new Security;

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activa</title>
    <link rel="icon" type="image/x-icon" href="/view/res/favicon_64.png">
    <?php
    // Fonts
    include 'view/css/common/fonts.php'
    ?>
    <link rel="stylesheet" href="/view/css/base.css">
    <?php
    // Set CSS files for view
    switch ($rqsted_view) {
        case View::LOGIN->value:
            $css_file_name = 'login';
            break;
        case View::MOVEMENT->value:
            $css_file_name = 'movement';
            break;
        case View::INTRADAY->value:
            $css_file_name = 'intraday.css';
            break;
        case View::USERS->value:
            $css_file_name = 'users';
            break;
        case View::USER->value:
            $css_file_name = 'user';
            break;
        case View::NOW->value:
            $css_file_name = 'now';
            break;
    }
    echo "<link rel='stylesheet' href='/view/css/{$css_file_name}.css'>";
    ?>
    <script defer src="/view/js/template.js"></script>
    <?php
    // Set JS files for view
    switch ($rqsted_view) {
        // case View::LOGIN->value:
        //     echo '<script defer src="/views/js/login.js"></script>';
        //     break;
        case View::MOVEMENT->value:
            echo '<script defer type="module" src="/view/js/movement.js"></script>';
            break;
        case View::INTRADAY->value:
            echo '<script defer type="module" src="/view/js/intraday.js"></script>';
            break;
        case View::USERS->value:
            echo '<script defer type="module" src="/view/js/users.js"></script>';
            break;
    }
    ?>
</head>
<body>
    <nav class="top-nav">
        <div class="top-nav__left-links">
            <?php
            if ($logged_in) {
                echo <<<HTML
                <a class="top-nav__link lg--display-none" id="menu-btn">
                    <img class="top-nav__image" src="/view/res/menu_light_64.png" alt="menu">
                </a>
                HTML;
            }
            ?>
            <!-- <a class="top-nav__link">
                <img class="top-nav__image" src="/view/res/home_light_64.png" alt="home">
                <span class="sm--display-none">&nbsp; HOME</span>
            </a> -->
            <!-- <a href="#" class="top-nav__link top-nav--expanded">SOLUCIONES</a> -->
        </div>
        <a <?php
            if ($logged_in) {
                echo 'id="user-btn" ';
            } else {
                echo 'href="/index.php?view=' . View::LOGIN->value . '" '; //urlFrndly-> echo 'href="/' . View::LOGIN->value . '"';
            }
        ?>class="top-nav__link">
            <span><?php
                echo $session_btn_cpt = $logged_in ? $_SESSION['user_name'] : 'Iniciar sesion'; 
            ?></span>
            <img class="top-nav__image" src="/view/res/usr_32.png" alt="login-img">
        </a>
        <?php
        if ($logged_in) {
            echo <<<HTML
            <div id="user-menu" class="sprclss--display-none">
                <!-- <a>Cambiar contraseña</a> -->
                <a id="logout-btn">Cerrar sesión</a>
            </div>
            HTML; 
        }
        ?>    
    </nav>
    <aside class="navigator">
        <ul id="navigator-list" class="navigator__list">
            <?php
            if ($logged_in) {
                switch ($_SESSION['role_id']) {
                    case 1: 
                        $views_array = ADM_VIEWS;
                        break;
                    case 2:
                        $views_array = EMP_VIEWS;
                        break;
                }

                foreach ($views_array as $view) {
                    echo '<a class="navigator__link" '
                        . 'href="/index.php?view=' . $view->value . '">'
                        . $view->caption() . '</a>';
                }
            }
            ?>
        </ul>
    </aside>
    <div class="curtain sprclss--display-none lg--display-none" id="curtain"></div>
    <main class="main-container">
        <?php
            switch ($rqsted_view) {
                case View::LOGIN->value:
                    include View::LOGIN->path();
                    break;
                // ADMIN VIEWS
                case View::NOW->value:
                    include View::NOW->path();
                    break;
                case View::PERIOD->value:
                    include View::PERIOD->path();
                    break;
                case View::ALL_PERIOD->value:
                    include View::ALL_PERIOD->path();
                    break;
                // EMPLOYEE VIEWS
                case View::MOVEMENT->value:
                    include View::MOVEMENT->path();
                    break;
                case View::INTRADAY->value:
                    include View::INTRADAY->path();
                    break;
                case View::ME_PERIOD->value:
                    include View::ME_PERIOD->path();
                    break;
                case View::USERS->value:
                    include View::USERS->path();
                    break;
                case View::USER->value:
                    include View::USER->path();
                    break;
                default:
                    echo 'Página inexistente';
                    break;
            }
        ?>
    </main>
    <footer>
        Powered by: RUMIA
    </footer>
    <dialog class="modal"></dialog>
</body>
</html>