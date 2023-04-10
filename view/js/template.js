const menuBtn = document.getElementById('menu-btn');
const curtain = document.querySelector('.curtain');
const navigator = document.querySelector('.navigator');
const userBtn = document.getElementById('user-btn');
const userMenu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');

if (userBtn !== null) {
    menuBtn.onclick = () => toggleNavigator();
}

if (userBtn !== null) {
    userBtn.onclick = () => toggleUserMenu();
}

if (logoutBtn !== null) {
    logoutBtn.addEventListener("click", () => {
        if (confirm("¿Estás seguro que querés salir de la aplicación?")) {
            window.location.href = "/controller/logout.php";
        }
    });
}

function toggleNavigator() {
    curtain.classList.toggle('sprclss--display-none');
    navigator.classList.toggle('navigator--showed');
}

function toggleUserMenu() {
    userMenu.classList.toggle('sprclss--display-none');
}
