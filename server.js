const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const playerColors = {};
const colors = ["rnbkqp", "RNBKQP"];
let moveLogServer = [];
let chessBoard = "";
let players = [];
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

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
    io.emit("numberOfPlayers", 2 - colors.length);
    AllyPiece = assignedColor;

    if (AllyPiece === "RNBKQP") {
        EnemyPiece = "rnbkqp";
    } else {
        EnemyPiece = "RNBKQP";
    }

    socket.on("disconnect", () => {
        for (let i = 0; i < players.length; i++) {
            if (players[i] === socket.id) players.splice(i, 1);
        }
        console.log(players);
        if (assignedColor) {
            colors.push(assignedColor);
        }
        const bothPlayersConnected = colors.length === 0;
        console.log(`user disconnected: ${socket.id}`);
        io.emit("numberOfPlayers", 2 - colors.length);

        if (players.length < 2) {
            console.log("Game reset because a player left.");
            io.emit("moves", []);
            io.emit(
                "ChessboardPosition",
                "rnbqkbnrpppppppp00000000000000000000000000000000PPPPPPPPRNBQKBNR"
            );
        }
    });

    socket.on("moves", (data) => {
        io.emit("moves", data);
    });

    socket.on("Promotion", (data) => {
        io.emit("Promotion", data);
    });

    socket.on("ChessboardPosition", (data) => {
        io.emit("ChessboardPosition", data);
    });

    socket.on("GameOver", (data) => {
        if (data !== 0) {
            io.emit("GameOver", data);
        }
    });

    socket.emit("AllyPiece", AllyPiece);
    socket.emit("EnemyPiece", EnemyPiece);
});

module.exports = server;
