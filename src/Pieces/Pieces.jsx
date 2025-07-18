import { css, keyframes } from "styled-components";
export default function Pieces({
  canThisPieceMove,
  toSelectPiece,
  player,
  pieceSize,
  roll,
  setToSelectPiece,
  setSelectedPiece,
}) {
  const canThisPieceBeSelected =
    player.id === toSelectPiece &&
    player.pieces.some((piece) => canThisPieceMove(player, piece, roll));
  const piecesWhichCanBeSelectedAndMoved = canThisPieceBeSelected
    ? player.pieces.filter((piece) => canThisPieceMove(player, piece, roll))
    : [];
  const halfPieceSize = `calc(${pieceSize}/2)`;
  const strokeWidth = `calc(${pieceSize}/14)`;
  const radius = `calc(${pieceSize}/2.5)`;
  const selectPiece = () => {
    if (canThisPieceBeSelected) {
      setSelectedPiece({ player, piece: piecesWhichCanBeSelectedAndMoved[0] });
      setToSelectPiece(null);
    }
  };
  const svgT = (
    <svg
      version="1.1"
      width={pieceSize}
      height={pieceSize}
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => selectPiece()}
    >
      <defs>
        <radialGradient id={`myGradient${player.color}`}>
          <stop offset="25%" stopColor="white" />
          <stop offset="100%" stopColor={player.color} />
        </radialGradient>
      </defs>
      <circle
        cx={halfPieceSize}
        cy={halfPieceSize}
        r={radius}
        fill={`url(#myGradient${player.color})`}
        stroke={"black"}
        strokeWidth={
          canThisPieceBeSelected
            ? `calc(${strokeWidth})`
            : `calc(${strokeWidth}/2)`
        }
        strokeDasharray={canThisPieceBeSelected ? "7 3" : ""}
      />
      <animate
        attributeName="stroke-dashoffset"
        values="360;0"
        dur="10s"
        repeatCount="indefinite"
      ></animate>
      {player.pieces.length > 1 && (
        <text
          x={halfPieceSize}
          y={halfPieceSize}
          fontSize={`calc(${halfPieceSize})`}
          fontFamily="Courier New"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="black"
        >
          {player.pieces.length}
        </text>
      )}
    </svg>
  );
  return svgT;
}
