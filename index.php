<?php
require "controller/config.php";
require "controller/security.php";

use controller\Security;

$security = new Security;

session_start();
if (isset($_SESSION['user_id'])) {
    $logged_in = true;

    if (isset($_GET["view"])){
        $rqsted_view = Views::tryFrom(strtolower($_GET["view"]));
        
        if ($rqsted_view === null) {
            $include_view = Views::ERROR_404;
        } elseif ($rqsted_view === Views::LOGIN) {
            $include_view = Views::ERROR_825;
        } elseif (($_SESSION['role_id'] === 1 && ! in_array($rqsted_view, ADM_VIEWS, true))
            || ($_SESSION['role_id'] === 2 && ! in_array($rqsted_view, EMP_VIEWS, true))) {
                $include_view = Views::ERROR_403;
        } else {
            $include_view = $rqsted_view;
        }
    } else {
        switch ($_SESSION["role_id"]) {
            case 1:
                $include_view = ADM_DEF_VIEW;
                break;
            case 2:
                $include_view = EMP_DEF_VIEW;
                break;
        }
    }
} else {
    $logged_in = false;
    $include_view = Views::LOGIN;
}   
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
    include 'view/common/fonts.php';

    // Set CSS file
    echo '<link rel="stylesheet" href="' . CSS_VIEW_PATH . $include_view->value . '".css">';
    
    // Set JS files
    echo '<script defer type="module" src="' . JS_VIEW_PATH . 'template.js"></script>';

    switch ($include_view) {
        case Views::LOGIN:
            $js_filename = Views::LOGIN->value;
            break;
        case Views::MOVEMENT:
            $js_filename = Views::MOVEMENT->value;
            break;
        case Views::INTRADAY:
            $js_filename = Views::INTRADAY->value;
            break;
        case Views::USERS:
            $js_filename = Views::USERS->value;
            break;
        case Views::PERIOD:
            $js_filename = Views::PERIOD->value;
            break;
        case Views::NOW:
            $js_filename = Views::NOW->value;
            break;
    }
    if (isset($js_filename)) echo '<script defer type="module" src="' . JS_VIEW_PATH . $js_filename . '.js"></script>';
    ?>
</head>
<body>
    <noscript>
        Habilit&aacute; JavaScript para ejecutar correctamente la aplicaci&oacute;n.
    </noscript>
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
                $login_view = Views::LOGIN->value;
                echo "href='{$login_view}'";
            }
        ?>class="top-nav__link">
            <span><?php
                echo $logged_in ? $_SESSION['user_name'] : 'Iniciar sesion'; 
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
                    echo '<a class="navigator__link" href="/' . $view->value . '">' . $view->caption() . '</a>';
                }
            }
            ?>
        </ul>
    </aside>
    <div class="curtain sprclss--display-none lg--display-none" id="curtain"></div>
    <main class="main-container">
        <?php 
        include ROOT_PATH . VIEW_PATH . $include_view->value . '.php';
        ?>
    </main>
    <footer>
        Powered by: RUMIA
    </footer>
    <dialog class="modal"></dialog>
</body>
</html>