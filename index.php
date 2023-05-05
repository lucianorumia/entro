<?php
require "controller/config.php";
require "controller/security.php";

use controller\Security;

$security = new Security;

session_start();

$url_id = $_GET['id'] ?? null;
$url_act = $_GET['act'] ?? null;

if (isset($_SESSION['user_id'])) {
    $logged_in = true;

    if (isset($_GET["view"])){
        $rqsted_view = Views::tryFrom(strtolower($_GET["view"]));
        
        if ($rqsted_view === null) {
            $include_view = Views::ERROR;
            $url_id = '404';
        } elseif ($rqsted_view === Views::LOGIN) {
            $include_view = Views::ERROR;
            $url_id = '825';
        } elseif (in_array($_SESSION['role_id'], $rqsted_view->autRole())) {
            $include_view = $rqsted_view;
        } else {
            $include_view = Views::ERROR;
            $url_id = '403';
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
    if ($include_view === Views::USERS) {
        if (isset($url_id)) $css_filename = $include_view->value . '-detail';
        elseif ($url_act === 'new') $css_filename = $include_view->value . '-new';
        else $css_filename = $include_view->value;
    } else {
        $css_filename = $include_view->value;
    }
    echo '<link rel="stylesheet" href="' . CSS_VIEW_PATH . $css_filename . '.css">';
    
    // Set JS files
    echo '<script defer type="module" src="' . JS_VIEW_PATH . 'template.js"></script>';

    if ($include_view === Views::USERS) {
        if (isset($url_id)) $js_filename = $include_view->value . '-detail';
        elseif ($url_act === 'new') $js_filename = $include_view->value . '-new';
        else $js_filename = $include_view->value;
    } else {
        $js_filename = $include_view->value;
    }
    echo '<script defer type="module" src="' . JS_VIEW_PATH . $js_filename . '.js"></script>';
    ?>
</head>
<body>
    <?php
    ?>
    <noscript>
        Habilit&aacute; JavaScript para ejecutar correctamente la aplicaci&oacute;n.
    </noscript>
    <?php include ROOT_PATH . VIEW_PATH . 'common/top-nav.php' ?>
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
        if ($include_view === Views::USERS) {
            if (isset($url_id)) include ROOT_PATH . VIEW_PATH . $include_view->value . '-detail.php';
            elseif ($url_act === 'new') include ROOT_PATH . VIEW_PATH . $include_view->value . '-new.php';
            else include ROOT_PATH . VIEW_PATH . $include_view->value . '.php';
        } else {
            include ROOT_PATH . VIEW_PATH . $include_view->value . '.php';
        }
        ?>
    </main>
    <footer>
        Powered by: RUMIA
    </footer>
    <dialog class="modal"></dialog>
</body>
</html>