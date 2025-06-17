'use client'
import { Button, Flex, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HowToPlayButton } from "../howToPlayButton";

enum gameModeEnum {
  classic,
}

export default function Game() {
  const [gameMode, setGameMode] = useState(gameModeEnum.classic);
  const [players, setPlayers] = useState(1);
  const [turnCount, setTurnCount] = useState(0);
  const [grid, setGrid] = useState(Array.from({ length: 8 }, () => Array(8).fill(-1))); //used AI to get the 8x8 grid initialization
  const [lastMove, setLastMove] = useState([-1,-1]);
  const [inputDebounce, setInputDebounce] = useState(false);
  const [gameUncontinuableFailsafe, setGameUncontinuableFailsafe] = useState(0);

  useEffect(() => {
    const params = new URL(document.location.toString()).searchParams;
    const gameModeQueryParam = params.get("type");
    setPlayers(params.get('players') as unknown as number); //'as unknown' required for tsLint otherwise ('string | null' =!> number)
    if (gameModeQueryParam === "classic") {
      setGameMode(gameModeEnum.classic);
    }
    const gridClone = grid;
    gridClone[3][3] = 0;
    gridClone[3][4] = 1;
    gridClone[4][3] = 1;
    gridClone[4][4] = 0;
  }, []);
  
  useEffect(() => {
    if (gameNotOver()) {
      if (noValidMoves()) {
        setGameUncontinuableFailsafe(gameUncontinuableFailsafe + 1);
        setTurnCount(turnCount + 1);
      } else {
        setGameUncontinuableFailsafe(0);
        if (players == 1 && getWhoseTurn() == 'whiteCircle') {
          setInputDebounce(true);
          setTimeout(() => {
            const aiChoice = getAiChoice();
            cellSelected(aiChoice[0], aiChoice[1], true);
            setInputDebounce(false);
          }, 1000);
        }
      }
    }
  }, [turnCount]);

  const gameNotOver = () => {
    if (gameUncontinuableFailsafe >= 2) {
      return false;
    }
    const allEmptySquares = getAllEmptySquares();
    return allEmptySquares.length != 0;
  }

  const noValidMoves = () => {
    const allEmptySquares = getAllEmptySquares();
    for (let [r, c] of allEmptySquares) {
      if (getFlippablePieces(r, c).length > 0) {
        return false;
      }
    }
    return true;
  }

  const getAiChoice = () => {
    const allEmptySquares = getAllEmptySquares();
    if (allEmptySquares.length === 1) {
      return allEmptySquares[0];
    }
    while(true) {
      const finalChoice = allEmptySquares[Math.floor(Math.random()*allEmptySquares.length)];
      if (getFlippablePieces(finalChoice[0], finalChoice[1]).length > 0) {
        return finalChoice;
      }
    }
  }

  const getAllEmptySquares = () => {
    return grid.flatMap((row, rowIndex) => row.map((value, columnIndex) => value == -1 ? [rowIndex, columnIndex] : []))
      .filter(choice => choice.length > 0);
  }

  const getWhoseTurn = () => {
    if (gameMode === gameModeEnum.classic) {
      return getWhoseTurnClassic();
    }
  }

  const getWhoText = () => {
    if (gameNotOver()) {
      if (getWhoseTurn() === 'blackCircle') {
        return "Player 1's Turn";
      } else if (players == 1) {
        return "Computer's Turn";
      } else {
        return "Player 2's Turn";
      }
    } else {
      return "Game Over"
    }
  }

  const getWhoseTurnClassic = () => {
    const value = turnCount % 2;
    if (value === 0) {
      return "blackCircle";
    } else {
      return "whiteCircle";
    }
  }
  
  const cellSelected = (rowIndex: number, columnIndex: number, override: boolean = false) => {
    if ((!override && inputDebounce) || !gameNotOver()) return;
    const flippablePieces = getFlippablePieces(rowIndex, columnIndex);
    if (flippablePieces.length > 0) {
      const valueToChangeTo = getWhoseTurn() === 'whiteCircle' ? 0 : 1;
      const gridClone = grid;
      gridClone[rowIndex][columnIndex] = valueToChangeTo;
      for (const [r, c] of flippablePieces) {
        gridClone[r][c] = valueToChangeTo;
      }
      setGrid(gridClone);
      setLastMove([rowIndex, columnIndex]);
      setTurnCount(turnCount + 1);
    }
  }

  //AI used to generate the grid check logic below (though I've modified it a fair bit)
  const getFlippablePieces = (rowIndex: number, columnIndex: number) => {
    if (grid[rowIndex][columnIndex] != -1) return [];
    const currentPlayerValue = getWhoseTurn() === 'whiteCircle' ? 0 : 1;
    const opponentValue = 1 - currentPlayerValue;
    const directions =  [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    const flips = [];

    for (const [dx, dy] of directions) {
      const toFlip = [];
      let r = rowIndex + dx;
      let c = columnIndex + dy;
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && grid[r][c] === opponentValue) {
        toFlip.push([r, c]);
        r += dx;
        c += dy;
      }
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && grid[r][c] === currentPlayerValue && toFlip.length > 0) {
        flips.push(...toFlip);
      }
    }

    return flips;
  }

  const getPoints = (whichPlayer: number) => {
    let count = 0;
    grid.forEach((row) => row.forEach((cell) => {
      if (cell === whichPlayer) {
        count += 1;
      }
    }));
    return count;
  }

  return (
    <Flex className="mainWrap">
      <Flex className="flexColumn gameBackContainer">
        <Typography className="whiteText title">Othello</Typography>
        <Flex className="mainGrid">
          {grid.map((row, rowIndex) => {
            return <Flex key={`row_${rowIndex}`}>
              {
                row.map((value, columnIndex) => {
                  let classToUse = `${value == 0 ? 'whiteCircle' : 'blackCircle'} circle circleAbs`;
                  return(
                    <Button key={`position_${rowIndex}_${columnIndex}`} className="gridSquare" onClick={() => cellSelected(rowIndex, columnIndex)}>
                      {/* AntD Flex requires a child to render */}
                      {value == -1 && <div></div>}
                      {value != -1 && <div className={classToUse}>
                        {(lastMove[0] == rowIndex && lastMove[1] == columnIndex) && <div className="redDot"></div>}
                      </div>}
                    </Button>
                  );
                })
              }
            </Flex>
          })}
        </Flex>
        {players == 2 && (
          <Flex>
            <div className={getWhoseTurn() + " circle"}></div>
          </Flex>
        )}
        <Flex className="bottomContainer">
          <Flex className="gameInfoContainer">
            <Flex className="pointsContainer">
              <Flex className="onePoint">
                <div className="blackCircle circle"></div>
                <Typography className="infoText">{getPoints(1)}</Typography>
              </Flex>
              <Flex className="onePoint">
                <div className="whiteCircle circle"></div>
                <Typography className="infoText">{getPoints(0)}</Typography>
              </Flex>
            </Flex>
            <Flex>
              <Typography className="infoText">{getWhoText()}</Typography>
            </Flex>
          </Flex>
          <Flex className="buttonContainer">
            <HowToPlayButton/>
            <Link href="/" className="quitButton">Quit</Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
