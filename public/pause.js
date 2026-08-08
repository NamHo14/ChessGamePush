const body = document.querySelector("body");
const pause = document.createElement("div");
body.appendChild(pause);
pause.classList.add("pause");
const bar1 = document.createElement("div");
const bar2 = document.createElement("div");
bar1.classList.add("bar1");
bar2.classList.add("bar2");
pause.append(bar1, bar2);
pause.addEventListener("click", stop);

function closeOverlayLikeUi() {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
        const all = [overlay, ...overlay.querySelectorAll("*")];
        all.forEach((elem) => {
            elem.remove();
        });
        return;
    }

    const statusCard = document.querySelector(
        "body > .cont[style*='position: fixed']"
    );
    if (statusCard) {
        statusCard.remove();
    }
}

function stop() {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const cont = document.createElement("div");
    cont.classList.add("cont");

    const resumeBtn = document.createElement("div");
    resumeBtn.classList.add("options");
    resumeBtn.textContent = "Resume";
    resumeBtn.addEventListener("click", resume);

    const restartBtn = document.createElement("div");
    restartBtn.classList.add("options");
    restartBtn.textContent = "Restart";
    restartBtn.addEventListener("click", restart);

    const quitBtn = document.createElement("div");
    quitBtn.classList.add("options");
    quitBtn.textContent = "Main Menu";
    quitBtn.addEventListener("click", quit);

    cont.append(resumeBtn, restartBtn, quitBtn);
    overlay.appendChild(cont);

    body.appendChild(overlay);

    if (mode === "online") {
        restartBtn.remove();
    }
}

function resume() {
    closeOverlayLikeUi();
}

function restart() {
    closeOverlayLikeUi();
    reset();
    if (CHESSAI === true && AIPiece === "RNBKQP") {
        AIMoveMaker();
    }
}

function quit() {
    closeOverlayLikeUi();
    reset();
    window.location.href = "index.html";
}
