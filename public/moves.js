function rookPossibleMoves(color, position, boardPos = ChessBoardPosition) {
    let allyPiece;
    let enemyPiece;
    if (color === "W") {
        allyPiece = "RBNKQP";
        enemyPiece = "rbnkqp";
    } else {
        enemyPiece = "RBNKQP";
        allyPiece = "rbnkqp";
    }

    let positionIndexList = [];

    const directions = [1, -1, -8, 8];
    let r = Math.floor(position / 8);
    let c = position % 8;

    for (let i = 0; i < directions.length; i++) {
        let j = 1;
        while (true) {
            let potentialIndex = position + directions[i] * j;
            let potentialRow = Math.floor(potentialIndex / 8);
            let potentialCol = potentialIndex % 8;

            if (
                potentialRow < 0 ||
                potentialRow >= 8 ||
                potentialCol < 0 ||
                potentialCol >= 8
            )
                break;

            if (
                (directions[i] === 1 || directions[i] === -1) &&
                potentialRow !== r
            )
                break;

            if (allyPiece.includes(boardPos[potentialIndex])) break;
            positionIndexList.push(potentialIndex);
            if (enemyPiece.includes(boardPos[potentialIndex])) break;
            j++;
        }
    }
    return positionIndexList;
}

function bishopPossibleMoves(color, position, boardPos = ChessBoardPosition) {
    let allyPiece;
    let enemyPiece;
    if (color === "W") {
        allyPiece = "RBNKQP";
        enemyPiece = "rbnkqp";
    } else {
        enemyPiece = "RBNKQP";
        allyPiece = "rbnkqp";
    }

    let positionIndexList = [];

    const directions = [9, 7, -9, -7];
    let r = Math.floor(position / 8);
    let c = position % 8;

    for (let i = 0; i < directions.length; i++) {
        let j = 1;
        while (true) {
            let potentialIndex = position + directions[i] * j;
            let potentialRow = Math.floor(potentialIndex / 8);
            let potentialCol = potentialIndex % 8;

            if (
                potentialRow < 0 ||
                potentialRow >= 8 ||
                potentialCol < 0 ||
                potentialCol >= 8 ||
                Math.abs(potentialCol - c) !== j ||
                Math.abs(potentialRow - r) !== j
            )
                break;

            if (allyPiece.includes(boardPos[potentialIndex])) break;
            positionIndexList.push(potentialIndex);
            if (enemyPiece.includes(boardPos[potentialIndex])) break;
            j++;
        }
    }
    return positionIndexList;
}
function knightPossibleMoves(color, position, boardPos = ChessBoardPosition) {
    let allyPiece;
    let enemyPiece;
    if (color === "W") {
        allyPiece = "RBNKQP";
        enemyPiece = "rbnkqp";
    } else {
        enemyPiece = "RBNKQP";
        allyPiece = "rbnkqp";
    }

    let positionIndexList = [];

    const directions = [-10, -6, -17, -15, 6, 15, 17, 10];
    let r = Math.floor(position / 8);
    let c = position % 8;

    for (let i = 0; i < directions.length; i++) {
        let potentialIndex = position + directions[i];
        let potentialRow = Math.floor(potentialIndex / 8);
        let potentialCol = potentialIndex % 8;

        if (
            potentialRow < 0 ||
            potentialRow >= 8 ||
            potentialCol < 0 ||
            potentialCol >= 8
        ) {
            continue;
        }

        let rowDiff = Math.abs(potentialRow - r);
        let colDiff = Math.abs(potentialCol - c);

        if (
            !(
                (rowDiff === 2 && colDiff === 1) ||
                (rowDiff === 1 && colDiff === 2)
            )
        ) {
            continue;
        }

        if (allyPiece.includes(boardPos[potentialIndex])) continue;
        positionIndexList.push(potentialIndex);
    }
    return positionIndexList;
}

function isSquareAttackedByColor(boardPos, targetSquare, attackerColor) {
    const allyPieces = attackerColor === "W" ? "RBNKQP" : "rbnkqp";

    for (let i = 0; i < boardPos.length; i++) {
        const piece = boardPos[i];
        if (!allyPieces.includes(piece)) {
            continue;
        }

        if (piece === "P") {
            if (pawnPossibleMoves("W", i, boardPos, true).includes(targetSquare)) {
                return true;
            }
            continue;
        }

        if (piece === "p") {
            if (pawnPossibleMoves("B", i, boardPos, true).includes(targetSquare)) {
                return true;
            }
            continue;
        }

        if (piece === "K" || piece === "k") {
            const r = Math.floor(i / 8);
            const c = i % 8;
            const tr = Math.floor(targetSquare / 8);
            const tc = targetSquare % 8;
            if (Math.max(Math.abs(tr - r), Math.abs(tc - c)) === 1) {
                return true;
            }
            continue;
        }

        const moves = possibleMoves(piece, i, boardPos);
        if (moves.includes(targetSquare)) {
            return true;
        }
    }

    return false;
}

function kingPossibleMoves(color, position, boardPos = ChessBoardPosition) {
    let allyPiece;
    let enemyPiece;
    if (color === "W") {
        allyPiece = "RBNKQP";
        enemyPiece = "rbnkqp";
    } else {
        enemyPiece = "RBNKQP";
        allyPiece = "rbnkqp";
    }

    let positionIndexList = [];

    const directions = [9, 7, -9, -7, 1, -1, 8, -8];
    let r = Math.floor(position / 8);
    let c = position % 8;

    for (let i = 0; i < directions.length; i++) {
        let potentialIndex = position + directions[i];
        let potentialRow = Math.floor(potentialIndex / 8);
        let potentialCol = potentialIndex % 8;

        if (
            potentialRow < 0 ||
            potentialRow >= 8 ||
            potentialCol < 0 ||
            potentialCol >= 8
        )
            continue;

        if (
            [9, 7, -9, -7].includes(directions[i]) &&
            (Math.abs(potentialCol - c) !== 1 ||
                Math.abs(potentialRow - r) !== 1)
        )
            continue;

        if ((directions[i] === 1 || directions[i] === -1) && potentialRow !== r)
            continue;

        if (allyPiece.includes(boardPos[potentialIndex])) continue;
        positionIndexList.push(potentialIndex);
        if (enemyPiece.includes(boardPos[potentialIndex])) continue;
    }
    if (color === "W") {
        if (moveLog.every((item) => !item.includes("K"))) {
            if (
                moveLog.every((item) => !item.includes("56R")) &&
                boardPos[57] === "0" &&
                boardPos[58] === "0" &&
                boardPos[59] === "0" &&
                boardPos[56] === "R" &&
                !check &&
                !isSquareAttackedByColor(boardPos, 60, "B") &&
                !isSquareAttackedByColor(boardPos, 59, "B") &&
                !isSquareAttackedByColor(boardPos, 58, "B")
            ) {
                positionIndexList.push(58);
            }
            if (
                moveLog.every((item) => !item.includes("63R")) &&
                boardPos[61] === "0" &&
                boardPos[62] === "0" &&
                boardPos[63] === "R" &&
                !check &&
                !isSquareAttackedByColor(boardPos, 60, "B") &&
                !isSquareAttackedByColor(boardPos, 61, "B") &&
                !isSquareAttackedByColor(boardPos, 62, "B")
            ) {
                positionIndexList.push(62);
            }
        }
    }
    if (color === "B") {
        if (moveLog.every((item) => !item.includes("k"))) {
            if (
                moveLog.every((item) => !item.includes("00r")) &&
                boardPos[1] === "0" &&
                boardPos[2] === "0" &&
                boardPos[3] === "0" &&
                boardPos[0] === "r" &&
                !check &&
                !isSquareAttackedByColor(boardPos, 4, "W") &&
                !isSquareAttackedByColor(boardPos, 3, "W") &&
                !isSquareAttackedByColor(boardPos, 2, "W")
            ) {
                positionIndexList.push(2);
            }
            if (
                moveLog.every((item) => !item.includes("07r")) &&
                boardPos[5] === "0" &&
                boardPos[6] === "0" &&
                boardPos[7] === "r" &&
                !check &&
                !isSquareAttackedByColor(boardPos, 4, "W") &&
                !isSquareAttackedByColor(boardPos, 5, "W") &&
                !isSquareAttackedByColor(boardPos, 6, "W")
            ) {
                positionIndexList.push(6);
            }
        }
    }
    return positionIndexList;
}

function queenPossibleMoves(color, position, boardPos = ChessBoardPosition) {
    let allyPiece;
    let enemyPiece;
    if (color === "W") {
        allyPiece = "RBNKQP";
        enemyPiece = "rbnkqp";
    } else {
        enemyPiece = "RBNKQP";
        allyPiece = "rbnkqp";
    }

    let positionIndexList = [];

    const directions = [9, 7, -9, -7, 1, -1, 8, -8];
    let r = Math.floor(position / 8);
    let c = position % 8;

    for (let i = 0; i < directions.length; i++) {
        let j = 1;
        while (true) {
            let potentialIndex = position + directions[i] * j;
            let potentialRow = Math.floor(potentialIndex / 8);
            let potentialCol = potentialIndex % 8;

            if (
                potentialRow < 0 ||
                potentialRow >= 8 ||
                potentialCol < 0 ||
                potentialCol >= 8
            )
                break;

            if (
                [9, 7, -9, -7].includes(directions[i]) &&
                (Math.abs(potentialCol - c) !== j ||
                    Math.abs(potentialRow - r) !== j)
            )
                break;

            if (
                (directions[i] === 1 || directions[i] === -1) &&
                potentialRow !== r
            )
                break;

            if (allyPiece.includes(boardPos[potentialIndex])) break;
            positionIndexList.push(potentialIndex);
            if (enemyPiece.includes(boardPos[potentialIndex])) break;
            j++;
        }
    }
    return positionIndexList;
}

function pawnPossibleMoves(
    color,
    position,
    boardPos = ChessBoardPosition,
    SquareUnderAttack = false
) {
    let allyPiece;
    let enemyPiece;
    let directionmult = 1;
    if (color === "W") {
        allyPiece = "RBNKQP";
        enemyPiece = "rbnkqp";
        directionmult = -1;
    } else {
        enemyPiece = "RBNKQP";
        allyPiece = "rbnkqp";
    }
    let positionIndexList = [];
    let squareUnderAttackList = [];

    const directions = [8, 16, 7, 9];
    let r = Math.floor(position / 8);
    let c = position % 8;

    for (let i = 0; i < directions.length; i++) {
        let potentialIndex = position + directions[i] * directionmult;
        let potentialRow = Math.floor(potentialIndex / 8);
        let potentialCol = potentialIndex % 8;

        if (
            potentialRow < 0 ||
            potentialRow >= 8 ||
            potentialCol < 0 ||
            potentialCol >= 8
        )
            continue;

        if (directions[i] * directionmult === 8 * directionmult) {
            if (allyPiece.includes(boardPos[potentialIndex])) continue;
            if (enemyPiece.includes(boardPos[potentialIndex])) continue;
        } else if (directions[i] * directionmult === 16 * directionmult) {
            if (r !== 6 && directionmult === -1) continue;
            if (r !== 1 && directionmult === 1) continue;
            if (
                allyPiece.includes(boardPos[potentialIndex]) ||
                allyPiece.includes(boardPos[potentialIndex - 8 * directionmult])
            )
                continue;
            if (
                enemyPiece.includes(boardPos[potentialIndex]) ||
                enemyPiece.includes(
                    boardPos[potentialIndex - 8 * directionmult]
                )
            )
                continue;
        }
        if (
            directions[i] * directionmult === 7 * directionmult ||
            directions[i] * directionmult === 9 * directionmult
        ) {
            if (moveLog.length !== 0) {
                const previousMove = moveLog[moveLog.length - 1];
                if (
                    Math.abs(
                        parseInt(previousMove.substring(0, 2)) -
                            parseInt(previousMove.substring(3))
                    ) === 16 &&
                    (previousMove[2] === "p" || previousMove[2] === "P") &&
                    potentialIndex ===
                        parseInt(previousMove.substring(3)) + 8 * directionmult
                ) {
                    if (
                        !(c === 0 && potentialIndex % 8 === 7) &&
                        !(c === 7 && potentialIndex % 8 === 0)
                    ) {
                        positionIndexList.push(potentialIndex);
                    }
                }
            }
            if (!enemyPiece.includes(boardPos[potentialIndex])) continue;
        }
        if (directions[i] === 7 || directions[i] === 9) {
            if (
                !(c === 0 && potentialIndex % 8 === 7) &&
                !(c === 7 && potentialIndex % 8 === 0)
            ) {
                squareUnderAttackList.push(potentialIndex);
            }
        }
        if (
            !(c === 0 && potentialIndex % 8 === 7) &&
            !(c === 7 && potentialIndex % 8 === 0)
        ) {
            positionIndexList.push(potentialIndex);
        }
    }
    if (!SquareUnderAttack) {
        return positionIndexList;
    } else {
        return squareUnderAttackList;
    }
}

function pawnPromotion(column, AllyPiece) {
    const cont = document.querySelector(".main-cont");
    for (let i = 0; i < 4; i++) {
        let src;
        const div = document.createElement("div");
        cont.appendChild(div);
        div.classList.add("square", "promotion");
        div.dataset.c = column;
        div.style.position = "absolute";
        const isWhite = AllyPiece === "RNBKQP";
        const isWrap =
            cont.style.flexWrap === "" || cont.style.flexWrap === "wrap";

        if (isWrap) {
            div.style.top = `${(isWhite ? i : 7 - i) * 11}vh`;
        } else {
            div.style.top = `${(isWhite ? 7 - i : i) * 11}vh`;
        }

        switch (i) {
            case 0:
                src = isWhite
                    ? "piece/Chess_qlt60.png"
                    : "piece/Chess_qdt60.png";
                div.id = isWhite ? "ql" : "qd";
                break;
            case 1:
                src = isWhite
                    ? "piece/Chess_rlt60.png"
                    : "piece/Chess_rdt60.png";
                div.id = isWhite ? "rl" : "rd";
                break;
            case 2:
                src = isWhite
                    ? "piece/Chess_nlt60.png"
                    : "piece/Chess_ndt60.png";
                div.id = isWhite ? "nl" : "nd";
                break;
            case 3:
                src = isWhite
                    ? "piece/Chess_blt60.png"
                    : "piece/Chess_bdt60.png";
                div.id = isWhite ? "bl" : "bd";
                break;
        }

        div.addEventListener("click", promoted);
        div.style.left = `${column * 11}vh`;
        const img = document.createElement("img");
        img.src = src;
        img.style.width = "100%";
        img.style.height = "100%";
        div.appendChild(img);
    }
}

function promoted(e) {
    const id = e.currentTarget.id;
    const c = e.currentTarget.dataset.c;
    switch (id) {
        case "ql":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, c) +
                "Q" +
                ChessBoardPosition.substring(parseInt(c) + 1);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "q";
            break;
        case "rl":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, c) +
                "R" +
                ChessBoardPosition.substring(parseInt(c) + 1);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "r";
            break;
        case "nl":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, c) +
                "N" +
                ChessBoardPosition.substring(parseInt(c) + 1);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "n";
            break;
        case "bl":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, c) +
                "B" +
                ChessBoardPosition.substring(parseInt(c) + 1);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "b";
            break;
        case "qd":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, 56 + parseInt(c)) +
                "q" +
                ChessBoardPosition.substring(parseInt(c) + 57);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "q";
            break;
        case "rd":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, 56 + parseInt(c)) +
                "r" +
                ChessBoardPosition.substring(parseInt(c) + 57);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "r";
            break;
        case "nd":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, 56 + parseInt(c)) +
                "n" +
                ChessBoardPosition.substring(parseInt(c) + 57);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "n";
            break;
        case "bd":
            ChessBoardPosition =
                ChessBoardPosition.substring(0, 56 + parseInt(c)) +
                "b" +
                ChessBoardPosition.substring(parseInt(c) + 57);
            moveLog[moveLog.length - 1] = moveLog[moveLog.length - 1] + "b";
            break;
    }
    if (CHESSAI) {
        AIMoveMaker();
    }
    positionUpdate(ChessBoardPosition);
    promotion = false;
    if (multiplayer) {
        socket.emit("Promotion", promotion);
        socket.emit("ChessboardPosition", ChessBoardPosition);
        socket.emit("moves", moveLog);
    }
    if (CHESSAI) {
        getAIMove(moveLog, ChessBoardPosition).then((aiMove) => {
            console.log("AI move:", aiMove);
        });
    }
    if (id.includes("l")) {
        document.getElementById("ql").remove();
        document.getElementById("bl").remove();
        document.getElementById("nl").remove();
        document.getElementById("rl").remove();
    } else {
        document.getElementById("qd").remove();
        document.getElementById("bd").remove();
        document.getElementById("nd").remove();
        document.getElementById("rd").remove();
    }
}
