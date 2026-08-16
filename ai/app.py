import math
from flask import Flask, request, jsonify
from flask_cors import CORS
import ai
import os
import random
import chess.polyglot

app = Flask(__name__)
CORS(app)

@app.route("/move", methods=["POST"])
def get_ai_move():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON body"}), 400

    move_log = data.get("move_log")
    board_input = data.get("board_input")

    if not isinstance(move_log, list) or not isinstance(board_input, str):
        return jsonify({"error": "Expected move_log (list) and board_input (string)"}), 400

    try:
        turn = len(move_log) % 2 == 0
        board = ai.translateMovelog(move_log)
        print("movelog123", move_log)
        print("board::", board)

        with chess.polyglot.open_reader("performance.bin") as reader:
            entries = list(reader.find_all(board))
            if entries:
                entry = random.choice(entries)
                move = ai.translateMove(board_input, entry.move.uci())
                print("bookset", move)
                return jsonify({"move": move})

        best_move, _ = ai.minimax(board, 3, -math.inf, math.inf, turn)
        if best_move is None:
            return jsonify({"error": "No legal move available"}), 422

        move = ai.translateMove(board_input, best_move.uci())
        print("Alpha beta", move)
        return jsonify({"move": move})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)