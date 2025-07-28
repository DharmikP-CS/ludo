import { useState, useEffect } from "react";
import getSvg from "./svg/getSvg";

export default function Dice({ roll, toSelectPiece, player, ...props }) {
  const color = player.color;
  const [diceBorderColor, setDiceBorderColor] = useState(color);

  useEffect(() => {
    if (!toSelectPiece) {
      const intervalId = setInterval(() => {
        setDiceBorderColor((prevBorderColor) => {
          return prevBorderColor === "black" ? color : "black";
        });
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [toSelectPiece, color]);

  return (
    <div
      {...props}
      style={{
        border: `solid ${diceBorderColor} 2px`,
        borderRadius: "5px",
      }}
    >
      {getSvg(roll, color)}
    </div>
  );
}
