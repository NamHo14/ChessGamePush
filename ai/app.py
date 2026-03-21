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
    data = request.json
    move_log = data["move_log"]
    board_input = data["board_input"]  
    turn = len(move_log) % 2 == 0
    board = ai.translateMovelog(move_log)
    print("movelog123", move_log)
    print("board::", board)
    try: 
        with chess.polyglot.open_reader("performance.bin") as reader:
            entries = list(reader.find_all(board))
            if entries:
                entry = random.choice(entries)
                move = ai.translateMove(board_input, entry.move.uci()) 
                print("bookset",move)
                return jsonify({"move": move}) 

        move = ai.translateMove(board_input,ai.minimax(board, 3, -math.inf, math.inf, turn)[0].uci())
        print("Alpha beta", move)
        return jsonify({"move": move})

    except TypeError as e:
        return


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)