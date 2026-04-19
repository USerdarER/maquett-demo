import { theme } from "../theme";
import { useEditState } from "../editing/useEditState";

export function Toolbar() {
  const { state, dispatch } = useEditState();
  const selectActive = state.mode === "idle";
  const drawActive = state.mode === "draw";
  const deleteEnabled = state.selectedId !== null;
  const selected = state.buildings.find((b) => b.id === state.selectedId) ?? null;

  const onSelect = () => {
    if (state.mode === "draw") dispatch({ type: "cancelDraw" });
  };
  const onDraw = () => {
    if (state.mode === "draw") dispatch({ type: "cancelDraw" });
    else dispatch({ type: "enterDrawMode" });
  };
  const onDelete = () => dispatch({ type: "deleteSelected" });

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        display: "flex",
        gap: 8,
        alignItems: "center",
        background: "rgba(35,35,48,0.85)",
        backdropFilter: "blur(8px)",
        padding: "8px 10px",
        borderRadius: 8,
        border: `1px solid ${theme.border}`,
      }}
    >
      <ToolbarButton label="Select" icon="↖" active={selectActive} onClick={onSelect} />
      <ToolbarButton label="Draw" icon="▭" active={drawActive} onClick={onDraw} />
      {drawActive && (
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: theme.dim, fontFamily: theme.mono, letterSpacing: 1 }}>
            FLOORS
          </span>
          <input
            type="number"
            min={1}
            max={20}
            value={state.floorCount}
            onChange={(e) => dispatch({ type: "setFloorCount", n: Number(e.target.value) })}
          />
        </label>
      )}
      <Divider />
      <ToolbarButton
        label="Delete"
        icon="✕"
        active={false}
        disabled={!deleteEnabled}
        onClick={onDelete}
        variant="danger"
      />
      {selected && (
        <div
          style={{
            fontSize: 10,
            color: theme.dim,
            fontFamily: theme.mono,
            paddingLeft: 8,
            borderLeft: `1px solid ${theme.border}`,
          }}
        >
          <span style={{ color: theme.warmAccent }}>●</span> Selected · {selected.floors} floors
        </div>
      )}
    </div>
  );
}

type ButtonProps = {
  label: string;
  icon: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  variant?: "default" | "danger";
};

function ToolbarButton({ label, icon, active, disabled, onClick, variant = "default" }: ButtonProps) {
  const borderColor = active
    ? theme.warmAccent
    : variant === "danger" && !disabled
      ? "rgba(212, 165, 116, 0.35)"
      : theme.border;
  const textColor = disabled ? theme.border : active ? theme.accentHi : theme.accent;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        background: active ? theme.warmAccentSoft : "transparent",
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        color: textColor,
        fontFamily: theme.mono,
        fontSize: 11,
        letterSpacing: 0.8,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 20, background: theme.border }} />;
}
