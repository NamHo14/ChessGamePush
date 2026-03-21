const btn = document.querySelectorAll("button");
btn.forEach((btn) => btn.addEventListener("click", play));

// Wake up servers on page load to avoid cold start delay
function wakeServers() {
    const isLocalHost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

    if (!isLocalHost) {
        // Wake up AI server
        const aiServerUrl =
            "https://chessgamepush-production.up.railway.app";
        fetch(aiServerUrl + "/move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                move_log: [],
                board_input:
                    "rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNR",
            }),
        }).catch(() => {}); // Ignore errors, just wake up

        // Wake up multiplayer server
        const multiplayerServerUrl =
            "https://prolific-smile-production-ce7d.up.railway.app";
        fetch(multiplayerServerUrl + "/health").catch(() => {}); // Ignore errors
    }
}

// Call wake-up on page load
window.addEventListener("load", wakeServers);

function play(e) {
    const type = e.target.className;
    if (type === "pve") {
        const cont = document.querySelector(".cont");
        const body = document.querySelector("body");
        const btns = document.querySelectorAll("button");
        btns.forEach((btn) => btn.remove());
        const header = document.querySelector("header");
        header.remove();
        cont.remove();

        const w = document.createElement("button");
        w.textContent = "White Side";
        w.classList.add("color");
        const b = document.createElement("button");
        b.textContent = "Black Side";
        b.classList.add("color");
        body.append(w, b);

        w.addEventListener("click", () => {
            localStorage.setItem("color", "white");
            localStorage.setItem("gameMode", type);
            window.location.href = "game.html";
        });

        b.addEventListener("click", () => {
            localStorage.setItem("color", "black");
            localStorage.setItem("gameMode", type);
            window.location.href = "game.html";
        });

        return;
    }

    localStorage.setItem("gameMode", type);
    window.location.href = "game.html";
}
