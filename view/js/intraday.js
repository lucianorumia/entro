import { msToHis, His } from "./modules/dates.js";

if (accumSeconds) {
    const nowTime = document.getElementById('now-time');
    const accumData = document.querySelector('.accum__data');
    const accumMs = accumSeconds * 1000;

    setInterval((accumMs) => {
        const now = new Date();
        const nowHis = His(now);
        nowTime.textContent = `${nowHis.H}:${nowHis.i}:${nowHis.s}`;
        const accum = accumMs + now.getTime();
        const accumHis = msToHis(accum);
        accumData.textContent = `${accumHis.H}:${accumHis.i}:${accumHis.s}`;
    }, 1000, accumMs);
}
