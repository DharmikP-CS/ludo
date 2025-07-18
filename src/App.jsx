import { cloneDeep, inRange, isNil } from "lodash";
import { useState } from "react";
import Dice from "./Dice/Dice";
import Pieces from "./Pieces/Pieces";
const isInBox = (box, point) => {
  const { topLeft, bottomRight } = box;
  return (
    point.x >= topLeft.x &&
    point.x <= bottomRight.x &&
    point.y >= topLeft.y &&
    point.y <= bottomRight.y
  );
};

const isEdgeOfBox = (box, point) => {
  if (!isInBox(box, point)) {
    return false;
  }
  const { topLeft, bottomRight } = box;
  const isXInRange = (x) => x >= topLeft.x && x <= bottomRight.x;
  const isYInRange = (x) => x >= topLeft.y && x <= bottomRight.y;
  const isTopEdge = point.y === topLeft.y && isXInRange(point.x);
  const isBottomEdge = point.y === bottomRight.y && isXInRange(point.x);
  const isLeftEdge = point.x === topLeft.x && isYInRange(point.y);
  const isRightEdge = point.x === bottomRight.x && isYInRange(point.y);
  return (
    isInBox(box, point) &&
    (isTopEdge || isRightEdge || isBottomEdge || isLeftEdge)
  );
};

const cellSize = "2.5rem";

export default function MyApp() {
  const playerPieceStartMapping = {
    1: {
      1: { x: 2, y: 2 },
      2: { x: 3, y: 2 },
      3: { x: 2, y: 3 },
      4: { x: 3, y: 3 },
    },
    2: {
      1: { x: 11, y: 2 },
      2: { x: 12, y: 2 },
      3: { x: 11, y: 3 },
      4: { x: 12, y: 3 },
    },
    3: {
      1: { x: 11, y: 11 },
      2: { x: 12, y: 11 },
      3: { x: 11, y: 12 },
      4: { x: 12, y: 12 },
    },
    4: {
      1: { x: 2, y: 11 },
      2: { x: 3, y: 11 },
      3: { x: 2, y: 12 },
      4: { x: 3, y: 12 },
    },
  };
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "p1",
      color: "red",
      pieces: [1, 2, 3, 4].map((id) => ({
        id,
        ...playerPieceStartMapping[1][id],
      })),
      startArea: {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: 5, y: 5 },
      },
      start: { x: 1, y: 6 },
      beforeHomePath: { x: 0, y: 7 },
      homePath: {
        topLeft: { x: 1, y: 7 },
        bottomRight: { x: 5, y: 7 },
      },
      home: { x: 6, y: 7 },
    },
    {
      id: 2,
      name: "p2",
      color: "green",
      pieces: [1, 2, 3, 4].map((id) => ({
        id,
        ...playerPieceStartMapping[2][id],
      })),
      startArea: {
        topLeft: { x: 9, y: 0 },
        bottomRight: { x: 14, y: 5 },
      },
      start: { x: 8, y: 1 },
      beforeHomePath: { x: 7, y: 0 },
      homePath: {
        topLeft: { x: 7, y: 1 },
        bottomRight: { x: 7, y: 6 },
      },
      home: { x: 7, y: 6 },
    },
    {
      id: 3,
      name: "p3",
      color: "yellow",
      pieces: [1, 2, 3, 4].map((id) => ({
        id,
        ...playerPieceStartMapping[3][id],
      })),
      startArea: {
        topLeft: { x: 9, y: 9 },
        bottomRight: { x: 14, y: 14 },
      },
      start: { x: 13, y: 8 },
      beforeHomePath: { x: 14, y: 7 },
      homePath: {
        topLeft: { x: 8, y: 7 },
        bottomRight: { x: 13, y: 7 },
      },
      home: { x: 8, y: 7 },
    },
    {
      id: 4,
      name: "p4",
      color: "blue",
      pieces: [1, 2, 3, 4].map((id) => ({
        id,
        ...playerPieceStartMapping[4][id],
      })),
      startArea: {
        topLeft: { x: 0, y: 9 },
        bottomRight: { x: 5, y: 14 },
      },
      start: { x: 6, y: 13 },
      beforeHomePath: { x: 7, y: 14 },
      homePath: {
        topLeft: { x: 7, y: 8 },
        bottomRight: { x: 7, y: 13 },
      },
      home: { x: 7, y: 8 },
    },
  ]);

  const [idOfPlayerWhoseTurnItIs, setIdOfPlayerWhoseTurnItIs] = useState(1);
  const [roll, setRoll] = useState(1);
  const [toSelectPiece, setToSelectPiece] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const isBeforeHomePathOfPlayer = (point, player) =>
    point.x === player.beforeHomePath.x && point.y === player.beforeHomePath.y;

  const getNextPosition = (player, piece, roll) => {
    if (isInBox(player.startArea, piece)) {
      return player.start;
    }
    const { x, y } = piece;
    if (y === 6) {
      if (inRange(x, 0, 6)) {
        if (x + roll > 5) {
          const remainingSteps = roll - (5 - x);
          return { x: 6, y: 5 - (remainingSteps - 1) };
        }
        return { x: x + roll, y };
      } else if (inRange(x, 9, 15)) {
        if (x + roll > 14) {
          const remainingSteps = roll - (14 - x);
          if (remainingSteps === 1) {
            return { x: 14, y: 7 };
          } else if (isBeforeHomePathOfPlayer({ x: 14, y: 7 }, player)) {
            return { x: 14 - (remainingSteps - 1), y: 7 };
          }
          return { x: 14 - (remainingSteps - 2), y: 8 };
        }
        return { x: x + roll, y };
      }
    } else if (y === 7) {
      if (x === 0) {
        if (isBeforeHomePathOfPlayer({ x: 0, y: 7 }, player)) {
          return { x: x + roll, y };
        }
        return { x: x + roll - 1, y: y - 1 };
      } else if (inRange(x, 1, 6)) {
        if (x + roll > 6) {
          // Can't move ahead
          return { x, y };
        }
        return { x: x + roll, y };
      } else if (x === 14) {
        if (isBeforeHomePathOfPlayer({ x: 14, y: 7 }, player)) {
          return { x: x - roll, y };
        }
        return { x: x - (roll - 1), y: y + 1 };
      } else if (inRange(x, 9, 14)) {
        if (x - roll < 8) {
          // Can't move ahead
          return { x, y };
        }
        return { x: x - roll, y };
      }
    } else if (y === 8) {
      if (inRange(x, 0, 6)) {
        if (x - roll < 0) {
          const remainingSteps = roll - (x - 0);
          if (remainingSteps === 1) {
            return { x: 0, y: 7 };
          } else if (isBeforeHomePathOfPlayer({ x: 0, y: 7 }, player)) {
            return { x: 0 + (remainingSteps - 1), y: 7 };
          }
          return { x: 0 + (remainingSteps - 2), y: 6 };
        }
        return { x: x - roll, y };
      } else if (inRange(x, 9, 15)) {
        if (x - roll < 9) {
          const remainingSteps = roll - (x - 9);
          return { x: 8, y: 9 + (remainingSteps - 1) };
        }
        return { x: x - roll, y };
      }
    } else if (x === 6) {
      if (inRange(y, 0, 6)) {
        if (y - roll < 0) {
          const remainingSteps = roll - (y - 0);
          if (remainingSteps === 1) {
            return { x: 7, y: 0 };
          } else if (isBeforeHomePathOfPlayer({ x: 7, y: 0 }, player)) {
            return { x: 7, y: 0 + remainingSteps - 1 };
          }
          return { x: 8, y: 0 + remainingSteps - 2 };
        }
        return { x, y: y - roll };
      } else if (inRange(y, 9, 15)) {
        if (y - roll < 9) {
          const remainingSteps = roll - (y - 9);
          return { x: 5 - (remainingSteps - 1), y: 8 };
        }
        return { x, y: y - roll };
      }
    } else if (x === 7) {
      if (y === 0) {
        if (isBeforeHomePathOfPlayer({ x: 7, y: 0 }, player)) {
          return { x, y: y + roll };
        }
        return { x: x + 1, y: 0 + roll - 1 };
      } else if (inRange(y, 1, 6)) {
        if (y + roll > 6) {
          // Can't move ahead
          return { x, y };
        }
        return { x, y: y + roll };
      } else if (y === 14) {
        if (isBeforeHomePathOfPlayer({ x: 7, y: 14 }, player)) {
          return { x, y: y - roll };
        }
        return { x: x - 1, y: y - (roll - 1) };
      } else if (inRange(y, 9, 14)) {
        if (y - roll < 8) {
          // Can't move ahead
          return { x, y };
        }
        return { x, y: y - roll };
      }
    } else if (x === 8) {
      if (inRange(y, 0, 6)) {
        if (y + roll > 5) {
          const remainingSteps = roll - (5 - y);
          return { x: 9 + (remainingSteps - 1), y: 6 };
        }
        return { x, y: y + roll };
      } else if (inRange(y, 9, 15)) {
        if (y + roll > 14) {
          const remainingSteps = roll - (14 - y);
          if (remainingSteps === 1) {
            return { x: 7, y: 14 };
          } else if (isBeforeHomePathOfPlayer({ x: 7, y: 14 }, player)) {
            return { x: 7, y: 14 - (remainingSteps - 1) };
          }
          return { x: 6, y: 14 - (remainingSteps - 2) };
        }
        return { x, y: y + roll };
      }
    }
  };

  const isHomeOfPlayer = (player, { x, y }) =>
    player.home.x === x && player.home.y === y;

  const safeCells = [
    { x: 1, y: 6 },
    { x: 6, y: 2 },
    { x: 8, y: 1 },
    { x: 12, y: 6 },
    { x: 13, y: 8 },
    { x: 8, y: 12 },
    { x: 6, y: 13 },
    { x: 2, y: 8 },
  ];

  const compIsSafe = ({ x, y }) =>
    !!safeCells.find((safeCell) => safeCell.x === x && safeCell.y === y);

  const areAllPiecesInHome = (player) =>
    player.pieces.every((piece) => isHomeOfPlayer(player, piece));

  const assignTurnToNext = () => {
    const activePlayers = players.filter(
      (player) => !areAllPiecesInHome(player)
    );
    const turnMapping = activePlayers.reduce((acc, player, i) => {
      acc[player.id] = activePlayers[(i + 1) % activePlayers.length].id;
      return acc;
    }, {});
    setIdOfPlayerWhoseTurnItIs(turnMapping[idOfPlayerWhoseTurnItIs]);
  };

  const movePiece = (player, piece) => {
    let takeTurnAgain = roll === 6;
    const nextCell = getNextPosition(player, piece, roll);
    console.log(piece, " nextCell ", nextCell);
    const isHomeCell = isHomeOfPlayer(player, nextCell);
    if (isHomeCell) {
      takeTurnAgain = true;
    }
    const isSafeCell = compIsSafe(nextCell);
    const currentPlayers = cloneDeep(players);
    const piecesToKillOnThisCell =
      !isHomeCell && !isSafeCell
        ? currentPlayers
            .filter((p) => p.id !== player.id)
            .map((p) => ({
              ...p,
              pieces: p.pieces.filter(
                ({ x, y }) => x === nextCell.x && y === nextCell.y
              ),
            }))
            .filter((p) => p.pieces.length)
        : [];
    if (piecesToKillOnThisCell.length) {
      takeTurnAgain = true;
    }
    currentPlayers
      .filter((p) => p.id !== player.id)
      .forEach((p) => {
        const playerPiecesToKillOnThisCell = piecesToKillOnThisCell.find(
          (p2) => p2.id === p.id
        );
        if (playerPiecesToKillOnThisCell) {
          p.pieces.forEach((pieceToPotentiallyKill) => {
            const toKillThisPiece = playerPiecesToKillOnThisCell.pieces.some(
              (p3) => p3.id === pieceToPotentiallyKill.id
            );
            if (toKillThisPiece) {
              const startOfThisPiece =
                playerPieceStartMapping[p.id][pieceToPotentiallyKill.id];
              pieceToPotentiallyKill.x = startOfThisPiece.x;
              pieceToPotentiallyKill.y = startOfThisPiece.y;
            }
          });
        }
      });
    const currentPlayer = currentPlayers.find((p) => p.id === player.id);
    const piece3 = currentPlayer.pieces.find(({ id }) => id === piece.id);
    piece3.x = nextCell.x;
    piece3.y = nextCell.y;

    if (areAllPiecesInHome(currentPlayer)) {
      takeTurnAgain = false;
    }
    setPlayers(currentPlayers);
    return takeTurnAgain;
  };

  if (selectedPiece) {
    const { player, piece } = selectedPiece;
    const takeTurnAgain = movePiece(player, piece);
    setSelectedPiece(null);
    if (!takeTurnAgain) {
      assignTurnToNext();
    }
  }

  const compHomeOfPlayer = ({ x, y }) =>
    players.find((player) => isHomeOfPlayer(player, { x, y }));

  const compHomePathOfPlayer = ({ x, y }) =>
    players.find((player) => isInBox(player.homePath, { x, y }));

  const compStartOfPlayer = ({ x, y }) =>
    players.find((player) => player.start.x === x && player.start.y === y);

  const compStartAreaEdgeOfPlayer = ({ x, y }) =>
    players.find((player) => isEdgeOfBox(player.startArea, { x, y }));

  const compPlayersWithPiecesInThisCell = ({ x, y }) =>
    players
      .map((player) => ({
        ...player,
        pieces: player.pieces.filter((piece) => piece.x === x && piece.y === y),
      }))
      .filter((player) => player.pieces.length);

  const canThisPieceMove = (player, piece, newRoll) => {
    const basicCheck =
      (newRoll === 6 || !isInBox(player.startArea, piece)) &&
      !isHomeOfPlayer(player, piece);
    if (!basicCheck) {
      return false;
    }
    const isOnHomePathOfPlayer = isInBox(player.homePath, piece);
    if (!isOnHomePathOfPlayer) {
      return basicCheck;
    }
    const home = player.home;
    const distToHome =
      piece.x === home.x
        ? Math.abs(piece.y - home.y)
        : Math.abs(piece.x - home.x);
    return distToHome >= newRoll;
  };
  const getPiecesAvailableToMove = (player, newRoll) =>
    player.pieces.filter((piece) => canThisPieceMove(player, piece, newRoll));

  const getHomeNeighbours = ({ x, y }) => {
    const topHomeNeighBour = players.find(
      (player) => x === player.home.x && y - 1 === player.home.y
    );
    const rightHomeNeighBour = players.find(
      (player) => x + 1 === player.home.x && y === player.home.y
    );
    const bottomHomeNeighBour = players.find(
      (player) => x === player.home.x && y + 1 === player.home.y
    );
    const leftHomeNeighBour = players.find(
      (player) => x - 1 === player.home.x && y === player.home.y
    );
    return {
      topHomeNeighBour,
      rightHomeNeighBour,
      bottomHomeNeighBour,
      leftHomeNeighBour,
    };
  };

  const getStyleForHomeNeighbour = ({ x, y }) => {
    const homeNeighbours = getHomeNeighbours({ x, y });
    const {
      topHomeNeighBour,
      rightHomeNeighBour,
      bottomHomeNeighBour,
      leftHomeNeighBour,
    } = homeNeighbours;
    const sideOrCorner =
      (rightHomeNeighBour && bottomHomeNeighBour) ||
      (leftHomeNeighBour && topHomeNeighBour)
        ? "to left bottom"
        : "to left top";
    let startColor = "white";
    let endColor = "white";
    if (rightHomeNeighBour && bottomHomeNeighBour) {
      startColor = rightHomeNeighBour.color;
      endColor = bottomHomeNeighBour.color;
    } else if (leftHomeNeighBour && topHomeNeighBour) {
      startColor = topHomeNeighBour.color;
      endColor = leftHomeNeighBour.color;
    } else if (leftHomeNeighBour && bottomHomeNeighBour) {
      startColor = bottomHomeNeighBour.color;
      endColor = leftHomeNeighBour.color;
    } else if (rightHomeNeighBour && topHomeNeighBour) {
      startColor = rightHomeNeighBour.color;
      endColor = topHomeNeighBour.color;
    } else {
      return;
    }
    return `linear-gradient(${sideOrCorner}, ${startColor} 50%, ${endColor} 50%)`;
  };

  const getRow = (y) => {
    const cells = [];
    for (let x = 0; x < 15; x++) {
      if (y === 7 && x === 7) {
        cells.push(
          <td
            style={{
              width: cellSize,
              height: cellSize,
              // border: "solid black",
              // display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
            key={x + "," + y}
          >
            <Dice
              onClick={takeTurn}
              roll={roll}
              player={players.find(
                (player) => player.id === idOfPlayerWhoseTurnItIs
              )}
            />
          </td>
        );
        continue;
      }
      const isSafe = compIsSafe({ x, y });
      const homeOfPlayer = compHomeOfPlayer({ x, y });
      const homePathOfPlayer = compHomePathOfPlayer({ x, y });
      const startOfPlayer = compStartOfPlayer({ x, y });
      const startAreaEdgeOfPlayer = compStartAreaEdgeOfPlayer({ x, y });
      const playersWithPiecesInThisCell = compPlayersWithPiecesInThisCell({
        x,
        y,
      });
      const player =
        homeOfPlayer ??
        homePathOfPlayer ??
        startOfPlayer ??
        startAreaEdgeOfPlayer;
      const backgroundColor = player?.color ?? (isSafe ? "orange" : "white");
      const styleForHomeNeighbour = getStyleForHomeNeighbour({ x, y });
      const style = {
        backgroundColor,
        ...(styleForHomeNeighbour && { background: styleForHomeNeighbour }),
        width: cellSize,
        height: cellSize,
        border: "solid black",
        textAlign: "center",
      };
      cells.push(
        <td style={style} key={x + "," + y}>
          {playersWithPiecesInThisCell.length
            ? playersWithPiecesInThisCell.map((player) => {
                return (
                  <Pieces
                    player={player}
                    toSelectPiece={toSelectPiece}
                    canThisPieceMove={canThisPieceMove}
                    pieceSize={`calc(${cellSize}/${playersWithPiecesInThisCell.length})`}
                    roll={roll}
                    key={x + "," + y}
                    setToSelectPiece={setToSelectPiece}
                    setSelectedPiece={setSelectedPiece}
                  />
                );
              })
            : ""}
        </td>
      );
    }
    return cells;
  };

  const getRows = () => {
    const rows = [];
    for (let y = 0; y < 15; y++) {
      rows.push(<tr key={y}>{getRow(y)}</tr>);
    }
    return rows;
  };

  const rollDice = () => {
    const array = new Uint32Array(1);
    self.crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
  };

  const takeTurn = () => {
    if (toSelectPiece) {
      return;
    }
    const newRoll = rollDice();
    setRoll(newRoll);
    const player = players.find(
      (player) => player.id === idOfPlayerWhoseTurnItIs
    );
    const piecesAvailableToMove = getPiecesAvailableToMove(player, newRoll);
    if (piecesAvailableToMove.length === 0) {
      if (newRoll !== 6) {
        setSelectedPiece(null);
        assignTurnToNext();
      } else {
        const piecesInStartArea = player.pieces.filter((piece) =>
          isInBox(player.startArea, piece)
        );
        if (piecesInStartArea.length !== 0) {
          const firstAvlblPieceInStartArea = piecesInStartArea[0];
          setSelectedPiece({ player, piece: firstAvlblPieceInStartArea });
        } else {
          setSelectedPiece(null);
          assignTurnToNext();
        }
      }
    } else if (piecesAvailableToMove.length === 1) {
      const pieceToMove = piecesAvailableToMove[0];
      setSelectedPiece({ player, piece: pieceToMove });
    } else {
      setToSelectPiece(player.id);
      setSelectedPiece(null);
    }
  };
  return (
    <div>
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>{getRows()}</tbody>
      </table>
    </div>
  );
}
