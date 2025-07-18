import getSvg from "./svg/getSvg";

export default function Dice({ roll, player, ...props }) {
  const color = player.color;
  return (
    <div
      {...props}
      style={{
        color,
        backgroundColor: "black",
      }}
    >
      {getSvg(roll, color)}
    </div>
  );
}
