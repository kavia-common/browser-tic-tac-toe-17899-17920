import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Tic Tac Toe - Modern Dark Themed React App
 * Features:
 * - Interactive 3x3 board
 * - Two-player mode
 * - Current player indicator
 * - Win/draw detection
 * - Restart game button
 * - Responsive, centered, accessible
 */

// Color constants from requirements for easy usage in inline styles
const COLORS = {
  accent: "#ff5722",
  primary: "#1976d2",
  secondary: "#757575",
};

/**
 * Determines if there's a winner given the current board.
 * Returns {winner: 'X' | 'O' | null, line: [idx, idx, idx] | null}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: null };
}

/**
 * Returns true if all squares are filled and there's no winner.
 */
function isDraw(squares) {
  return squares.every((sq) => sq !== null) && !calculateWinner(squares).winner;
}

// PUBLIC_INTERFACE
function App() {
  // State: squares (Array of 9), true = X's turn, status, lastWinLine
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("");
  const [winLine, setWinLine] = useState(null);

  // Effect: recalculate game status after move
  useEffect(() => {
    const { winner, line } = calculateWinner(squares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      setWinLine(line);
    } else if (isDraw(squares)) {
      setStatus("Draw!");
      setWinLine(null);
    } else {
      setStatus(`Current Player: ${isXNext ? "X" : "O"}`);
      setWinLine(null);
    }
  }, [squares, isXNext]);

  // Move handler
  // PUBLIC_INTERFACE
  const handleSquareClick = (idx) => {
    if (squares[idx] || calculateWinner(squares).winner) return;
    const newSquares = squares.slice();
    newSquares[idx] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext((prev) => !prev);
  };

  // Restart handler
  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setStatus("Current Player: X");
    setWinLine(null);
  };

  // Theme (Dark always but optional toggle)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Keyboard accessibility support
  // PUBLIC_INTERFACE
  const handleKeyDown = (event, idx) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      !squares[idx] &&
      !calculateWinner(squares).winner
    ) {
      handleSquareClick(idx);
    }
  };

  // Render
  return (
    <div
      className="tictactoe-root"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <main
        className="tictactoe-container"
        style={{
          background: "var(--bg-secondary)",
          borderRadius: 18,
          boxShadow: "0 4px 32px rgba(0,0,0,0.28)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "24px 0",
          maxWidth: 370,
          minWidth: 280,
        }}
      >
        <h1 style={{
          color: COLORS.primary,
          marginBottom: 12,
          fontSize: "2rem",
          letterSpacing: 1,
          textShadow: "0 2px 8px rgba(25,118,210,0.15)",
          fontWeight: 800,
        }}>
          Tic-Tac-Toe
        </h1>
        {/* Status / Current Player */}
        <div
          className="current-player"
          style={{
            color:
              status.startsWith("Winner") ? COLORS.accent :
              status === "Draw!" ? COLORS.secondary : COLORS.primary,
            fontSize: "1.12rem",
            fontWeight: 600,
            marginBottom: 24,
            letterSpacing: 1,
            minHeight: 32,
            textAlign: "center",
          }}
          aria-live="polite"
        >
          {status}
        </div>
        {/* Game Board */}
        <div
          className="board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 68px)",
            gridTemplateRows: "repeat(3, 68px)",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
            background: "var(--bg-primary)",
            borderRadius: 18,
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            padding: 16,
          }}
          role="grid"
          aria-label="Tic Tac Toe Board"
        >
          {squares.map((square, idx) => {
            const isWinning = winLine?.includes(idx);
            return (
              <button
                key={idx}
                className="square"
                style={{
                  width: 68,
                  height: 68,
                  fontSize: "2.35rem",
                  fontWeight: 700,
                  color: square === "X" ? COLORS.primary : square === "O" ? COLORS.accent : "var(--text-primary)",
                  background: isWinning
                    ? "rgba(255,87,34,0.12)"
                    : "var(--bg-secondary)",
                  border: isWinning
                    ? `3px solid ${COLORS.accent}`
                    : `2px solid var(--border-color)`,
                  borderRadius: 14,
                  transition: "all 0.16s",
                  cursor: square || calculateWinner(squares).winner ? "default" : "pointer",
                  outline: "none",
                }}
                tabIndex={0}
                role="gridcell"
                aria-label={
                  square
                    ? `Player ${square} on position ${idx + 1}`
                    : `Empty cell at position ${idx + 1}`
                }
                aria-disabled={square || !!calculateWinner(squares).winner}
                onClick={() => handleSquareClick(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                disabled={!!square || !!calculateWinner(squares).winner}
              >
                {square}
              </button>
            );
          })}
        </div>
        {/* Controls */}
        <button
          className="restart-btn"
          onClick={handleRestart}
          style={{
            background: COLORS.accent,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "12px 30px",
            fontSize: "1.12rem",
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: "0 2px 6px rgba(0,0,0,0.09)",
            cursor: "pointer",
            transition: "all 0.18s",
          }}
          aria-label="Restart game"
        >
          Restart
        </button>
        <div
          style={{
            color: "var(--text-secondary)",
            fontSize: 14,
            marginTop: 18,
            textAlign: "center",
            opacity: 0.6,
          }}
        >
          Two player: X goes first. <br />
          <span style={{ color: COLORS.primary }}>Blue = X</span>,{" "}
          <span style={{ color: COLORS.accent }}>Orange = O</span>
        </div>
      </main>
      <footer style={{ color: "var(--text-secondary)", marginTop: 24, fontSize: 14, opacity: 0.7 }}>
        © {new Date().getFullYear()} Tic Tac Toe
      </footer>
    </div>
  );
}

export default App;
