<?php
    require 'controller/movement.php';
    require 'model/connection.php';
    require 'model/movement.php';

    use controller\Movement as Movement_ctrl;

    $movement_ctrl = new Movement_ctrl;
    $last_mov = $movement_ctrl->lastUserMov($_SESSION['user_id']);
?>
<script>
    const fran = '<?php echo $security->franEncrypt(View::MOVEMENT->value) ?>';
    const userKey = '<?php echo $security->aideEncrypt($_SESSION['user_id']) ?>';
    const lastMov = JSON.parse('<?php echo json_encode($last_mov) ?>');
</script>
<div class="sprclss--multi-x">
    <div class="movement">
        <div class="movement__clock">
            <p id=clock-date></p>
            <p id=clock-time></p>
        </div>
        <button class="movement__button"></button>
        <div class="movement__info">
            <div class="movement__info-item">
                <p class="movement__info-title">&Uacute;ltimo ingreso:</p>
                <p class="movement__info-description">
                    <span id="entry-date"></span>
                    <span id="entry-time"></span>
                </p>
            </div>
            <div class="movement__info-item">
                <p class="movement__info-title">Tiempo transcurrido:</p>
                <p class="movement__info-description" id="time-elapsed"></p>
            </div>
        </div>
    </div>
    <div class="confirm">
        <form class="confirm-form">
            <div class="confirm-form__movement-type"></div>
            <label>Contraseña:</label>
            <input type="password" class="confirm-form__input" id="pass-input" required>
            <label class="sprclss--display-none" >Mensaje:</label>
            <textarea class="sprclss--display-none confirm-form__input confirm-form__textarea" id="msg-input" rows="4"></textarea>
            <div class="confirm-form__buttons-area">
                <input type="button" class="confirm-form__button" id="cancel-btn" value="&#x2715;">
                <input type="submit" class="confirm-form__button" id="confirm-btn"  value="&#x2713;">
            </div>
        </form>
    </div>
</div>
