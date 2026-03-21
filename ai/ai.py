import chess
import math
import random

board = chess.Board()


def translateBoard(board):
    board_str = str(board).replace("\n", "")
    board_str = str(board_str).replace(".", "0")
    board_str = str(board_str).replace(" ", "")
    return board_str

EvaluationTables = {
    "PawnMG" : 
    [0,   0,   0,   0,   0,   0,  0,   0,
    98, 134,  61,  95,  68, 126, 34, -11,
     -6,   7,  26,  31,  65,  56, 25, -20,
    -14,  13,   6,  21,  23,  12, 17, -23,
    -27,  -2,  -5,  12,  17,   6, 10, -25,
    -26,  -4,  -4, -10,   3,   3, 33, -12,
    -35,  -1, -20, -23, -15,  24, 38, -22,
    0,   0,   0,   0,   0,   0,  0,   0],
    
    "PawnEG" : [      
    0,   0,   0,   0,   0,   0,   0,   0,
    178, 173, 158, 134, 147, 132, 165, 187,
     94, 100,  85,  67,  56,  53,  82,  84,
     32,  24,  13,   5,  -2,   4,  17,  17,
     13,   9,  -3,  -7,  -7,  -8,   3,  -1,
      4,   7,  -6,   1,   0,  -5,  -1,  -8,
     13,   8,   8,  10,  13,   0,   2,  -7,
      0,   0,   0,   0,   0,   0,   0,   0],

    "KnightMG" : [
    -167, -89, -34, -49,  61, -97, -15, -107,
     -73, -41,  72,  36,  23,  62,   7,  -17,
     -47,  60,  37,  65,  84, 129,  73,   44,
      -9,  17,  19,  53,  37,  69,  18,   22,
     -13,   4,  16,  13,  28,  19,  21,   -8,
     -23,  -9,  12,  10,  19,  17,  25,  -16,
     -29, -53, -12,  -3,  -1,  18, -14,  -19,
    -105, -21, -58, -33, -17, -28, -19,  -23
    ],

    "KnightEG" : [
    -58, -38, -13, -28, -31, -27, -63, -99,
    -25,  -8, -25,  -2,  -9, -25, -24, -52,
    -24, -20,  10,   9,  -1,  -9, -19, -41,
    -17,   3,  22,  22,  22,  11,   8, -18,
    -18,  -6,  16,  25,  16,  17,   4, -18,
    -23,  -3,  -1,  15,  10,  -3, -20, -22,
    -42, -20, -10,  -5,  -2, -20, -23, -44,
    -29, -51, -23, -15, -22, -18, -50, -64
    ],

    "BishopMG" : [
    -29,   4, -82, -37, -25, -42,   7,  -8,
    -26,  16, -18, -13,  30,  59,  18, -47,
    -16,  37,  43,  40,  35,  50,  37,  -2,
     -4,   5,  19,  50,  37,  37,   7,  -2,
     -6,  13,  13,  26,  34,  12,  10,   4,
      0,  15,  15,  15,  14,  27,  18,  10,
      4,  15,  16,   0,   7,  21,  33,   1,
    -33,  -3, -14, -21, -13, -12, -39, -21
    ],

    "BishopEG" : [
    -14, -21, -11,  -8, -7,  -9, -17, -24,
     -8,  -4,   7, -12, -3, -13,  -4, -14,
      2,  -8,   0,  -1, -2,   6,   0,   4,
     -3,   9,  12,   9, 14,  10,   3,   2,
     -6,   3,  13,  19,  7,  10,  -3,  -9,
    -12,  -3,   8,  10, 13,   3,  -7, -15,
    -14, -18,  -7,  -1,  4,  -9, -15, -27,
    -23,  -9, -23,  -5, -9, -16,  -5, -17,
    ],

    "RookMG" : [
    32,  42,  32,  51, 63,  9,  31,  43,
     27,  32,  58,  62, 80, 67,  26,  44,
     -5,  19,  26,  36, 17, 45,  61,  16,
    -24, -11,   7,  26, 24, 35,  -8, -20,
    -36, -26, -12,  -1,  9, -7,   6, -23,
    -45, -25, -16, -17,  3,  0,  -5, -33,
    -44, -16, -20,  -9, -1, 11,  -6, -71,
    -19, -13,   1,  17, 16,  7, -37, -26
    ],

    "RookEG" : [
    13, 10, 18, 15, 12,  12,   8,   5,
    11, 13, 13, 11, -3,   3,   8,   3,
     7,  7,  7,  5,  4,  -3,  -5,  -3,
     4,  3, 13,  1,  2,   1,  -1,   2,
     3,  5,  8,  4, -5,  -6,  -8, -11,
    -4,  0, -5, -1, -7, -12,  -8, -16,
    -6, -6,  0,  2, -9,  -9, -11,  -3,
    -9,  2,  3, -1, -5, -13,   4, -20
    ],

    "QueenMG" : [
    -28,   0,  29,  12,  59,  44,  43,  45,
    -24, -39,  -5,   1, -16,  57,  28,  54,
    -13, -17,   7,   8,  29,  56,  47,  57,
    -27, -27, -16, -16,  -1,  17,  -2,   1,
     -9, -26,  -9, -10,  -2,  -4,   3,  -3,
    -14,   2, -11,  -2,  -5,   2,  14,   5,
    -35,  -8,  11,   2,   8,  15,  -3,   1,
     -1, -18,  -9,  10, -15, -25, -31, -50
    ],

    "QueenEG" : [
     -9,  22,  22,  27,  27,  19,  10,  20,
    -17,  20,  32,  41,  58,  25,  30,   0,
    -20,   6,   9,  49,  47,  35,  19,   9,
      3,  22,  24,  45,  57,  40,  57,  36,
    -18,  28,  19,  47,  31,  34,  39,  23,
    -16, -27,  15,   6,   9,  17,  10,   5,
    -22, -23, -30, -16, -16, -23, -36, -32,
    -33, -28, -22, -43,  -5, -32, -20, -41,
    ],

    "KingMG" : [
    -65,  23,  16, -15, -56, -34,   2,  13,
     29,  -1, -20,  -7,  -60,  -4, -38, -29,
     -9,  24,   2, -16, -20,   6,  22, -22,
    -17, -20, -12, -27, -30, -25, -14, -36,
    -49,  -1, -27, -39, -46, -44, -33, -51,
    -14, -14, -22, -46, -44, -30, -15, -27,
      1,   7,  -8, -64, -43, -16,   9,   8,
    -15,  36,  12, -54,   8, -28,  24,  14,
    ],

    "KingEG" : [
    -74, -35, -18, -18, -11,  15,   4, -17,
    -12,  17,  14,  17,  17,  38,  23,  11,
     10,  17,  23,  15,  20,  45,  44,  13,
     -8,  22,  24,  27,  26,  33,  26,   3,
    -18,  -4,  21,  24,  27,  23,   9, -11,
    -19,  -3,  11,  21,  23,  16,   7,  -9,
    -27, -11,   4,  13,  14,   4,  -5, -17,
    -53, -34, -21, -11, -28, -14, -24, -43
    ],
}
piece_phase = {
        'P': 0, 'p': 0,
        'N': 1, 'n': 1,
        'B': 1, 'b': 1,
        'R': 2, 'r': 2,
        'Q': 4, 'q': 4,
        'K': 0, 'k': 0,
        '0': 0
    }

def RelativePieceValues(PieceType, index):
    row = index // 8
    col = index % 8
    mirrorIndex = (7 - row) * 8 + col
    match PieceType:
        case "R":
            valueEG = (EvaluationTables["RookEG"][index]+512) 
            valueMG = (EvaluationTables["RookMG"][index]+477)
            return valueEG, valueMG
        case "N":
            valueEG = (EvaluationTables["KnightEG"][index]+281)
            valueMG = (EvaluationTables["KnightMG"][index]+337)
            return valueEG, valueMG
        case "B":
            valueEG = (EvaluationTables["BishopEG"][index]+297)  
            valueMG = (EvaluationTables["BishopMG"][index]+365)
            return valueEG, valueMG
        case "Q":
            valueEG = (EvaluationTables["QueenEG"][index]+936)
            valueMG = (EvaluationTables["QueenMG"][index]+1025)
            return valueEG, valueMG
        case "K":
            valueEG = EvaluationTables["KingEG"][index] 
            valueMG = EvaluationTables["KingMG"][index]
            return valueEG, valueMG
        case "P":
            valueEG = (EvaluationTables["PawnEG"][index]+94) 
            valueMG = (EvaluationTables["PawnMG"][index]+82)
            return valueEG, valueMG
        case "r":
            valueEG = (EvaluationTables["RookEG"][mirrorIndex]+512) 
            valueMG = (EvaluationTables["RookMG"][mirrorIndex ]+477)
            return -valueEG, -valueMG
        case "n":
            valueEG = (EvaluationTables["KnightEG"][mirrorIndex ]+281) 
            valueMG = (EvaluationTables["KnightMG"][mirrorIndex ]+337)
            return -valueEG, -valueMG
        case "b":
            valueEG = (EvaluationTables["BishopEG"][mirrorIndex ]+297) 
            valueMG = (EvaluationTables["BishopMG"][mirrorIndex ]+365)
            return -valueEG, -valueMG
        case "q":
            valueEG = (EvaluationTables["QueenEG"][mirrorIndex ]+936) 
            valueMG = (EvaluationTables["QueenMG"][mirrorIndex ]+1025)
            return -valueEG, -valueMG
        case "k":
            valueEG = EvaluationTables["KingEG"][mirrorIndex]  
            valueMG = EvaluationTables["KingMG"][mirrorIndex]
            return -valueEG, -valueMG
        case "p":
            valueEG = (EvaluationTables["PawnEG"][mirrorIndex]+94) 
            valueMG = (EvaluationTables["PawnMG"][mirrorIndex]+82)
            return -valueEG, -valueMG
    return 0,0




def valueBoard(board):
    EGtotalValue = 0
    MGtotalValue = 0
    
    phase = sum(piece_phase.get(piece, 0) for piece in board)
    if phase > 24:phase = 24

    for i in range(len(board)):
        EGtotalValue += RelativePieceValues(board[i], i)[0]
        MGtotalValue += RelativePieceValues(board[i], i)[1]
    return ((MGtotalValue * phase) + (EGtotalValue * (24-phase)))/24




def minimax(positionBoard, depth, alpha, beta, color):
    if depth == 0 or positionBoard.is_game_over():
        if positionBoard.is_checkmate():
            return None, -math.inf if color else math.inf
        elif positionBoard.is_stalemate() or positionBoard.is_insufficient_material():
            return None, 0
        else: 
            return None, valueBoard(translateBoard(positionBoard))

    bestMove = None
    moves = list(positionBoard.legal_moves)
    random.shuffle(moves)

    if color:

        maxEval = -math.inf
        for move in moves:
            piece = positionBoard.piece_at(move.from_square)
            if piece and piece.piece_type == chess.PAWN:
                if chess.square_rank(move.from_square) == 6 and chess.square_rank(move.to_square) == 7:
                    move = chess.Move(move.from_square, move.to_square, promotion=chess.QUEEN)
            positionBoard.push(move)
            _, eval = minimax(positionBoard, depth - 1, alpha, beta, False)
            positionBoard.pop()

        

            if eval > maxEval:
                maxEval = eval
                bestMove = move
            alpha = max(alpha, eval)
            if beta <= alpha:
                break

        if bestMove is None:
            legal_moves = list(positionBoard.legal_moves)
            if legal_moves:
                return legal_moves[0], maxEval
            else:
                return None, 0
        return bestMove, maxEval

    else:

        minEval = math.inf
        for move in moves:
            piece = positionBoard.piece_at(move.from_square)
            if piece and piece.piece_type == chess.PAWN:
                if chess.square_rank(move.from_square) == 6 and chess.square_rank(move.to_square) == 7:
                    move = chess.Move(move.from_square, move.to_square, promotion=chess.QUEEN)
            
            positionBoard.push(move)

            _, eval = minimax(positionBoard, depth - 1, alpha, beta, True)
            positionBoard.pop()

            
            if eval < minEval:
                minEval = eval
                bestMove = move
            beta = (min(beta, eval))
            if beta <= alpha:
                break

        if bestMove is None:
            legal_moves = list(positionBoard.legal_moves)
            if legal_moves:
                return legal_moves[0], minEval
            else:
                return None, 0
        return bestMove, minEval



index_to_square = {
    0: "a8", 1: "b8", 2: "c8", 3: "d8", 4: "e8", 5: "f8", 6: "g8", 7: "h8",
    8: "a7", 9: "b7", 10: "c7", 11: "d7", 12: "e7", 13: "f7", 14: "g7", 15: "h7",
    16: "a6", 17: "b6", 18: "c6", 19: "d6", 20: "e6", 21: "f6", 22: "g6", 23: "h6",
    24: "a5", 25: "b5", 26: "c5", 27: "d5", 28: "e5", 29: "f5", 30: "g5", 31: "h5",
    32: "a4", 33: "b4", 34: "c4", 35: "d4", 36: "e4", 37: "f4", 38: "g4", 39: "h4",
    40: "a3", 41: "b3", 42: "c3", 43: "d3", 44: "e3", 45: "f3", 46: "g3", 47: "h3",
    48: "a2", 49: "b2", 50: "c2", 51: "d2", 52: "e2", 53: "f2", 54: "g2", 55: "h2",
    56: "a1", 57: "b1", 58: "c1", 59: "d1", 60: "e1", 61: "f1", 62: "g1", 63: "h1"
}
square_to_index = {v: k for k, v in index_to_square.items()}




def translateMovelog(moveLog):
    board = chess.Board()
    for move in moveLog:
        moves = str(index_to_square[int(move[0:2])]) + str(index_to_square[int(move[3:5])])+(str(move[5]) if len(move) > 5 else "")
        board.push_uci(moves)

    return board


def translateMove(board, move):
    return str(square_to_index[move[0:2]]) + board[square_to_index[move[0:2]]] + str(square_to_index[move[2:4]])



