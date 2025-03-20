import React, { useState, useEffect } from 'react'; // Import React and hooks
import './App.css'; // Import CSS styles

// Main App component
const App = () => {
  // State Hooks
  const [board, setBoard] = useState(Array(9).fill(null)); // Initialize board state with 9 null values
  const [isXNext, setIsXNext] = useState(true); // Track whose turn it is (X or O)
  const [winner, setWinner] = useState(null); // Track the winner
  const [score, setScore] = useState({ X: 0, O: 0 }); // Initialize score for X and O
  const [isPlayingWithBot, setIsPlayingWithBot] = useState(false); // Track if playing with a bot

  // Handle click on a square
  const handleClick = (index) => {
    // If the square is already filled or there's a winner, return early
    if (board[index] || winner) return;

    const newBoard = board.slice(); // Create a copy of the board
    newBoard[index] = isXNext ? 'X' : 'O'; // Set the current player's mark
    setBoard(newBoard); // Update the board state
    setIsXNext(!isXNext); // Switch turns
    checkWinner(newBoard); // Check for a winner
  };

  // Check for a winner
  const checkWinner = (board) => {
    const lines = [ // Winning combinations
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Check each winning line
    for (let line of lines) {
      const [a, b, c] = line; // Destructure line
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]); // Set the winner
        setScore((prevScore) => ({ // Update the score
          ...prevScore,
          [board[a]]: prevScore[board[a]] + 1,
        }));
        return; // Exit the function
      }
    }

    // If the board is full and no winner, it's a draw
    if (!board.includes(null)) {
      setWinner('Draw');
    }
  };

  // Reset the game
  const handleReset = () => {
    setBoard(Array(9).fill(null)); // Reset board to empty
    setWinner(null); // Clear the winner
    setIsXNext(true); // Reset turn to X
  };

  // Render a single square
  const renderSquare = (index) => (
    <button className="square" onClick={() => handleClick(index)}>
      {board[index]} {/* Display the mark in the square */}
    </button>
  );

  // Handle bot's turn (if playing with bot)
  const handleBotTurn = () => {
    const emptySquares = board.map((val, index) => (val === null ? index : null)).filter((val) => val !== null); // Find empty squares
    const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)]; // Pick a random empty square
    
    // Make the bot's move after a short delay
    setTimeout(() => {
      handleClick(randomIndex);
    }, 1000); 
  };

  // Use effect hook to trigger bot's turn
  useEffect(() => {
    if (isPlayingWithBot && !isXNext && !winner) { // Only if it's the bot's turn and there is no winner
      handleBotTurn(); // Let the bot make a move
    }
  }, [isXNext, isPlayingWithBot, winner]); // Dependencies for the effect

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <h2>
        {winner ? (winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`) : `Player ${isXNext ? 'X' : 'O'}'s Turn`}
      </h2>
      <div className="board">
        {Array(9).fill(null).map((_, index) => renderSquare(index))} {/* Render the squares */}
      </div>
      <button className="reset" onClick={handleReset}>Reset</button> {/* Reset button */}
      <div className="score">
        <h3>Score</h3>
        <p>X: {score.X}</p> {/* Display X's score */}
        <p>O: {score.O}</p> {/* Display O's score */}
      </div>
      <button className="toggle-bot" onClick={() => setIsPlayingWithBot(!isPlayingWithBot)}>
        {isPlayingWithBot ? 'Switch to Player vs Player' : 'Play Against Bot'} {/* Toggle bot mode */}
      </button>
    </div>
  );
};

export default App; // Export the App component