import { msToHis } from "./modules/dates.js";

if (accumSeconds) {
    const accumData = document.querySelector('.accum__data');
    const accumMs = accumSeconds * 1000;

    setInterval((accumMs) => {
        const now = new Date().getTime();
        const accum = accumMs + now;
        const accumHis = msToHis(accum);
        const accumStr = `${accumHis.H}:${accumHis.i}:${accumHis.s}`;
        accumData.textContent = accumStr;
    }, 1000, accumMs);
}
