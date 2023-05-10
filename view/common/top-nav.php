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
        <?php
        if ($include_view !== Views::LOGIN) {
            echo '<div id="user-menu"><a';

            if ($logged_in) {
                echo ' id="user-btn"';
            } else {
                $login_view = Views::LOGIN->value;
                echo " href='/{$login_view}'";
            }

            echo ' class="top-nav__link">'
                . '<span>';
            echo $logged_in ? $_SESSION['user_name'] : 'Iniciar sesion';
            echo '</span>'
                . '<img class="top-nav__image" src="/view/res/usr_32.png" alt="login-img"></a>';

            if ($logged_in) {
                echo <<<HTML
                <div id="user-options">
                    <!-- <a class="user-menu__option" >Info usuario</a> -->
                    <!-- <a class="user-menu__option" >Cambiar contraseña</a> -->
                    <a class="user-menu__option" id="logout-btn">Cerrar sesión</a>
                </div>
    HTML;
            }    
            
            echo '</div>';
        }    
        ?>    
    </nav>