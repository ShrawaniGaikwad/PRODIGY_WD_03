import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [xTurn, setXTurn] = useState(true);
  const [count, setCount] = useState(1);
  const [winner, setWinner] = useState('');
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [gameMode, setGameMode] = useState('twoPlayers');
  const buttonsRef = useRef([]);

  const winningPattern = [
    [0, 1, 2],
    [0, 3, 6],
    [2, 5, 8],
    [6, 7, 8],
    [3, 4, 5],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    if (gameMode === 'singlePlayer' && !xTurn) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, xTurn]);

  const handleButtonClick = (index) => {
    console.log(count)
    if (!winner) {
      const newCount = count + 1;
      setCount(newCount);
      if (newCount >= 5) {
        checkWinner();
      }
      setXTurn(!xTurn);
      buttonsRef.current[index].innerText = xTurn ? 'X' : 'O';
      buttonsRef.current[index].disabled = true;
      checkWinner(); 
    }
  };

  const checkWinner = () => {
    winningPattern.forEach((pattern) => {
      const [a, b, c] = pattern;
      if (
        buttonsRef.current[a].innerText &&
        buttonsRef.current[a].innerText === buttonsRef.current[b].innerText &&
        buttonsRef.current[a].innerText === buttonsRef.current[c].innerText
      ) {
        setWinner(buttonsRef.current[a].innerText);
        setButtonsDisabled(true);
      }
    });
  
    const allButtonsFilled = buttonsRef.current.every(button => button.innerText);
    if (!winner && allButtonsFilled && !buttonsDisabled) {
      const isWinnerAvailable = winningPattern.some((pattern) => {
        const [a, b, c] = pattern;
        return (
          buttonsRef.current[a].innerText &&
          buttonsRef.current[a].innerText === buttonsRef.current[b].innerText &&
          buttonsRef.current[a].innerText === buttonsRef.current[c].innerText
        );
      });
  
      if (!isWinnerAvailable) {
        setWinner('Draw');
      }
    }
  };
  
  

  const handleRestart = () => {
    setCount(1);
    setWinner('');
    setButtonsDisabled(false);
    buttonsRef.current.forEach((button) => {
      button.innerText = '';
      button.disabled = false;
    });
  };

  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    handleRestart();
  };

  const makeComputerMove = () => {
    const emptyCells = [];
    buttonsRef.current.forEach((button, index) => {
      if (button.innerText === '') {
        emptyCells.push(index);
      }
    });

    for (let i = 0; i < winningPattern.length; i++) {
      const [a, b, c] = winningPattern[i];
      if (
        buttonsRef.current[a].innerText === 'O' &&
        buttonsRef.current[b].innerText === 'O' &&
        buttonsRef.current[c].innerText === ''
      ) {
        handleButtonClick(c);
        return;
      } else if (
        buttonsRef.current[a].innerText === 'O' &&
        buttonsRef.current[c].innerText === 'O' &&
        buttonsRef.current[b].innerText === ''
      ) {
        handleButtonClick(b);
        return;
      } else if (
        buttonsRef.current[b].innerText === 'O' &&
        buttonsRef.current[c].innerText === 'O' &&
        buttonsRef.current[a].innerText === ''
      ) {
        handleButtonClick(a);
        return;
      }
    }

    for (let i = 0; i < winningPattern.length; i++) {
      const [a, b, c] = winningPattern[i];
      if (
        buttonsRef.current[a].innerText === 'X' &&
        buttonsRef.current[b].innerText === 'X' &&
        buttonsRef.current[c].innerText === ''
      ) {
        handleButtonClick(c);
        return;
      } else if (
        buttonsRef.current[a].innerText === 'X' &&
        buttonsRef.current[c].innerText === 'X' &&
        buttonsRef.current[b].innerText === ''
      ) {
        handleButtonClick(b);
        return;
      } else if (
        buttonsRef.current[b].innerText === 'X' &&
        buttonsRef.current[c].innerText === 'X' &&
        buttonsRef.current[a].innerText === ''
      ) {
        handleButtonClick(a);
        return;
      }
    }
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cellIndex = emptyCells[randomIndex];
      handleButtonClick(cellIndex);
    }

    checkWinner();
  };

  return (
    <>
    <h1 style={{textAlign:'center'}}>Welcome To The Tic-Tac-Toe Game</h1>
    <div className="wrapper">
      <div className="mode-buttons">
        <button id="restart" onClick={() => handleGameModeChange('twoPlayers')}>2 Players</button>
        <button id="restart" onClick={() => handleGameModeChange('singlePlayer')}>Computer</button>
      </div>
      <div className="container">
        {Array.from({ length: 9 }).map((_, index) => (
          <button
            key={index}
            className="button-option"
            onClick={() => handleButtonClick(index)}
            ref={(el) => (buttonsRef.current[index] = el)}
            disabled={buttonsDisabled || (gameMode === 'singlePlayer' && !xTurn)}
          ></button>
        ))}
      </div>
      
      <button id="restart" onClick={handleRestart}>
        Restart
      </button>
      {winner && (
        <div className="popup">
          <p id="message">{winner === 'Draw' ? "It's a Draw" : `'${winner}' Wins`}</p>
          <button id="new-game" onClick={handleRestart}>
            New Game
          </button>
        </div>
      )}
    </div>
    </>
  );
}

export default App;
