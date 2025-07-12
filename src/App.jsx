import { cloneDeep } from "lodash";
import { useState } from "react";
import Dice from "./Dice/Dice";

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
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "p1",
      color: "red",
      isPlaying: "true",
      pieces: [
        { id: 1, x: 2, y: 2 },
        { id: 2, x: 3, y: 2 },
        { id: 3, x: 2, y: 3 },
        { id: 4, x: 3, y: 3 },
      ],
      startArea: {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: 5, y: 5 },
      },
      start: { x: 1, y: 6 },
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
      isPlaying: "true",
      pieces: [
        { id: 1, x: 11, y: 2 },
        { id: 2, x: 12, y: 2 },
        { id: 3, x: 11, y: 3 },
        { id: 4, x: 12, y: 3 },
      ],
      startArea: {
        topLeft: { x: 9, y: 0 },
        bottomRight: { x: 14, y: 5 },
      },
      start: { x: 8, y: 1 },
      homePath: {
        topLeft: { x: 7, y: 1 },
        bottomRight: { x: 7, y: 6 },
      },
      home: { x: 7, y: 6 },
    },
    {
      id: 3,
      name: "p3",
      color: "blue",
      isPlaying: "true",
      pieces: [
        { id: 1, x: 2, y: 11 },
        { id: 2, x: 3, y: 11 },
        { id: 3, x: 2, y: 12 },
        { id: 4, x: 3, y: 12 },
      ],
      startArea: {
        topLeft: { x: 0, y: 9 },
        bottomRight: { x: 5, y: 14 },
      },
      start: { x: 6, y: 13 },
      homePath: {
        topLeft: { x: 7, y: 8 },
        bottomRight: { x: 7, y: 13 },
      },
      home: { x: 7, y: 8 },
    },
    {
      id: 4,
      name: "p4",
      color: "yellow",
      isPlaying: "true",
      pieces: [
        { id: 1, x: 11, y: 11 },
        { id: 2, x: 12, y: 11 },
        { id: 3, x: 11, y: 12 },
        { id: 4, x: 12, y: 12 },
      ],
      startArea: {
        topLeft: { x: 9, y: 9 },
        bottomRight: { x: 14, y: 14 },
      },
      start: { x: 13, y: 8 },
      homePath: {
        topLeft: { x: 8, y: 7 },
        bottomRight: { x: 13, y: 7 },
      },
      home: { x: 8, y: 7 },
    },
  ]);
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
  const [idOfPlayerWhoseTurnItIs, setIdOfPlayerWhoseTurnItIs] = useState(1);
  const [roll, setRoll] = useState(1);

  const compIsSafe = (x, y) =>
    !!safeCells.find((safeCell) => safeCell.x === x && safeCell.y === y);
  const compHomeOfPlayer = (x, y) =>
    players.find((player) => player.home.x === x && player.home.y === y);
  const compHomePathOfPlayer = (x, y) =>
    players.find((player) => isInBox(player.homePath, { x, y }));
  const compStartOfPlayer = (x, y) =>
    players.find((player) => player.start.x === x && player.start.y === y);
  const compStartAreaEdgeOfPlayer = (x, y) =>
    players.find((player) => isEdgeOfBox(player.startArea, { x, y }));
  const compPlayersWithPiecesInThisCell = (x, y) =>
    players
      .map((player) => ({
        ...player,
        pieces: player.pieces.filter((piece) => piece.x === x && piece.y === y),
      }))
      .filter((player) => player.pieces.length);
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
      const isSafe = compIsSafe(x, y);
      const homeOfPlayer = compHomeOfPlayer(x, y);
      const homePathOfPlayer = compHomePathOfPlayer(x, y);
      const startOfPlayer = compStartOfPlayer(x, y);
      const startAreaEdgeOfPlayer = compStartAreaEdgeOfPlayer(x, y);
      const playersWithPiecesInThisCell = compPlayersWithPiecesInThisCell(x, y);
      const player =
        homeOfPlayer ??
        homePathOfPlayer ??
        startOfPlayer ??
        startAreaEdgeOfPlayer;
      const backgroundColor = player?.color ?? (isSafe ? "orange" : "white");
      cells.push(
        <td
          style={{
            backgroundColor,
            width: cellSize,
            height: cellSize,
            border: "solid black",
            textAlign: "center",
          }}
          key={x + "," + y}
        >
          {playersWithPiecesInThisCell.length
            ? playersWithPiecesInThisCell.map(
                (player) =>
                  player.id +
                  ":" +
                  player.pieces.map((piece) => piece.id).join(", ")
              )
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

  const assignTurnToNext = () =>
    setIdOfPlayerWhoseTurnItIs(
      (idOfPlayerWhoseTurnItIs2) => ((idOfPlayerWhoseTurnItIs2 + 1) % 4) + 1
    );

  const rollDice = () => {
    const array = new Uint32Array(1);
    self.crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
  };
  const takeTurn = () => {
    const roll = rollDice();
    setRoll(roll);
    const player = players.find(
      (player) => player.id === idOfPlayerWhoseTurnItIs
    );
    const pieces = player.pieces;
    const areAllPiecesInStartArea = pieces.every((piece) =>
      isInBox(player.startArea, piece)
    );
    if (areAllPiecesInStartArea) {
      if (roll !== 6) {
        assignTurnToNext();
        return;
      } else {
        const firstAvlblPieceInStartArea = pieces.find((piece) =>
          isInBox(player.startArea, piece)
        );
        setPlayers((currentPlayers) => {
          const players = cloneDeep(currentPlayers);
          const player = players.find(
            (player) => player.id === idOfPlayerWhoseTurnItIs
          );
          const piece = player.pieces.find(
            (piece) => piece.id === firstAvlblPieceInStartArea.id
          );
          piece.x = player.start.x;
          piece.y = player.start.y;
          return players;
        });
        assignTurnToNext();
        return;
      }
    }
    assignTurnToNext();
  };
  return (
    <div>
      <table style={{ borderCollapse: "collapse" }}>
        <tbody>{getRows()}</tbody>
      </table>
    </div>
  );
}
