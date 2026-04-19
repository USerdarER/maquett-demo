import { theme } from "../../theme";

type Props = {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
};

export function Toggle({ label, icon, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "10px 12px",
        background: active ? theme.warmAccentSoft : "transparent",
        border: `1px solid ${active ? theme.warmAccent : theme.border}`,
        borderRadius: 6,
        cursor: "pointer",
        transition: "all 0.25s",
        color: active ? theme.accentHi : theme.dim,
        fontFamily: theme.mono,
        fontSize: 11,
        letterSpacing: 0.5,
      }}
    >
      <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{icon}</span>
      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          transition: "all 0.25s",
          background: active ? theme.warmAccent : theme.border,
          boxShadow: active ? `0 0 6px ${theme.warmAccent}` : "none",
        }}
      />
    </button>
  );
}
