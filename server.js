const express = require("express");
const app = express();
const server = require("http").createServer(app);
const allowedOrigins = (
    process.env.CLIENT_ORIGINS ||
    "http://localhost:5500,https://chess-game-pwkg.onrender.com"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const io = require("socket.io")(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("CORS not allowed"), false);
        },
    },
});

const colors = ["rnbkqp", "RNBKQP"];
const INITIAL_BOARD =
    "rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNR";

let moveLogServer = [];
let chessBoard = INITIAL_BOARD;
let promotionServer = false;
let lastMoveBy = null;
let players = [];
const socketToColor = new Map();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

function resetGameState() {
    moveLogServer = [];
    chessBoard = INITIAL_BOARD;
    promotionServer = false;
    lastMoveBy = null;
}

function isValidMoveLog(data) {
    if (!Array.isArray(data)) {
        return false;
    }
    return data.every(
        (move) =>
            typeof move === "string" &&
            /^\d{2}[prnbqkPRNBQK]\d{2}[qrbnQRBN]?$/.test(move)
    );
}

function isValidBoard(data) {
    return typeof data === "string" && /^[prnbqkPRNBQK0]{64}$/.test(data);
}

function expectedTurnColor() {
    return moveLogServer.length % 2 === 0 ? "RNBKQP" : "rnbkqp";
}

io.on("connection", (socket) => {
    console.log("user: " + socket.id);
    players.push(socket.id);
    console.log(players);
    if (colors.length <= 0) {
        console.log(`Connection refused: ${socket.id}`);
        socket.emit("full", "Server is full. Try again later.");
        socket.emit("full", 1);
        socket.disconnect(true);
        return;
    }

    const assignedColor = colors.pop();
    socketToColor.set(socket.id, assignedColor);
    io.emit("numberOfPlayers", 2 - colors.length);

    const allyPiece = assignedColor;
    const enemyPiece = allyPiece === "RNBKQP" ? "rnbkqp" : "RNBKQP";

    socket.emit("AllyPiece", allyPiece);
    socket.emit("EnemyPiece", enemyPiece);
    socket.emit("moves", moveLogServer);
    socket.emit("Promotion", promotionServer);
    socket.emit("ChessboardPosition", chessBoard);

    socket.on("disconnect", () => {
        players = players.filter((id) => id !== socket.id);
        console.log(players);

        const color = socketToColor.get(socket.id);
        socketToColor.delete(socket.id);
        if (color && !colors.includes(color)) {
            colors.push(color);
        }
        if (assignedColor && !colors.includes(assignedColor)) {
            colors.push(assignedColor);
        }

        console.log(`user disconnected: ${socket.id}`);
        io.emit("numberOfPlayers", 2 - colors.length);

        if (players.length < 2) {
            console.log("Game reset because a player left.");
            resetGameState();
            io.emit("moves", moveLogServer);
            io.emit("Promotion", promotionServer);
            io.emit("ChessboardPosition", chessBoard);
        }
    });

    socket.on("moves", (data) => {
        const assigned = socketToColor.get(socket.id);
        if (!assigned || assigned !== expectedTurnColor()) {
            return;
        }
        if (!isValidMoveLog(data)) {
            return;
        }
        if (data.length !== moveLogServer.length + 1) {
            return;
        }
        for (let i = 0; i < moveLogServer.length; i++) {
            if (moveLogServer[i] !== data[i]) {
                return;
            }
        }
        moveLogServer = data.slice();
        lastMoveBy = socket.id;
        io.emit("moves", moveLogServer);
    });

    socket.on("Promotion", (data) => {
        if (typeof data !== "boolean") {
            return;
        }
        promotionServer = data;
        io.emit("Promotion", promotionServer);
    });

    socket.on("ChessboardPosition", (data) => {
        if (lastMoveBy !== socket.id) {
            return;
        }
        if (!isValidBoard(data)) {
            return;
        }
        chessBoard = data;
        lastMoveBy = null;
        io.emit("ChessboardPosition", chessBoard);
    });

    socket.on("GameOver", (data) => {
        if ([1, 2, 3].includes(data)) {
            io.emit("GameOver", data);
        }
    });
});

module.exports = server;
