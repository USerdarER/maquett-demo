import { theme } from "../theme";

type Props = {
  pointsPlaced: number;
};

export function DrawHint({ pointsPlaced }: Props) {
  const message =
    pointsPlaced === 0
      ? "Click first corner on the terrain"
      : "Click opposite corner  ·  Esc to cancel";
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(35,35,48,0.85)",
        backdropFilter: "blur(8px)",
        borderRadius: 6,
        padding: "8px 16px",
        border: `1px solid ${theme.warmAccent}`,
        color: theme.accentHi,
        fontFamily: theme.mono,
        fontSize: 11,
        letterSpacing: 1.5,
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}
