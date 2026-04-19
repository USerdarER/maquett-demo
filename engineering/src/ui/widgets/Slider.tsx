import { theme } from "../../theme";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  unit?: string;
};

export function Slider({ label, value, min, max, onChange, unit = "" }: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span
          style={{
            fontSize: 10,
            color: theme.dim,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            fontFamily: theme.mono,
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 11, color: theme.accentHi, fontFamily: theme.mono, fontWeight: 600 }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 3,
          appearance: "none",
          borderRadius: 2,
          outline: "none",
          cursor: "pointer",
          background: `linear-gradient(to right, ${theme.warmAccent} ${pct}%, ${theme.border} ${pct}%)`,
        }}
      />
    </div>
  );
}
