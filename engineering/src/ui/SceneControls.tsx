import { theme } from "../theme";
import { Slider } from "./widgets/Slider";
import { Toggle } from "./widgets/Toggle";

type Props = {
  showBuildings: boolean;
  setShowBuildings: (v: boolean) => void;
  showRoads: boolean;
  setShowRoads: (v: boolean) => void;
  showContours: boolean;
  setShowContours: (v: boolean) => void;
  lightAngle: number;
  setLightAngle: (n: number) => void;
  lightElevation: number;
  setLightElevation: (n: number) => void;
  buildingCount: number;
};

export function SceneControls({
  showBuildings,
  setShowBuildings,
  showRoads,
  setShowRoads,
  showContours,
  setShowContours,
  lightAngle,
  setLightAngle,
  lightElevation,
  setLightElevation,
  buildingCount,
}: Props) {
  return (
    <div
      style={{
        width: 260,
        minWidth: 260,
        height: "100%",
        background: theme.panel,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: theme.accentHi, fontFamily: theme.mono }}>
          MAQUETT
        </div>
        <div style={{ fontSize: 9, color: theme.dim, marginTop: 4, fontFamily: theme.mono, letterSpacing: 1 }}>
          100m × 100m · 10,000 m² · 1m contours
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "18px 16px" }}>
        <div
          style={{
            fontSize: 9,
            color: theme.dim,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 10,
            fontFamily: theme.mono,
          }}
        >
          Visibility
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
          <Toggle label="Buildings" icon="▣" active={showBuildings} onClick={() => setShowBuildings(!showBuildings)} />
          <Toggle label="Roads" icon="═" active={showRoads} onClick={() => setShowRoads(!showRoads)} />
          <Toggle label="Contour Lines" icon="◎" active={showContours} onClick={() => setShowContours(!showContours)} />
        </div>

        <div
          style={{
            fontSize: 9,
            color: theme.dim,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 12,
            fontFamily: theme.mono,
          }}
        >
          Sun Position
        </div>
        <Slider label="Azimuth" value={lightAngle} min={0} max={360} onChange={setLightAngle} unit="°" />
        <Slider label="Elevation" value={lightElevation} min={5} max={85} onChange={setLightElevation} unit="°" />

        <div
          style={{
            marginTop: 20,
            padding: 14,
            background: "rgba(0,0,0,0.15)",
            borderRadius: 6,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: theme.dim,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 10,
              fontFamily: theme.mono,
            }}
          >
            Legend
          </div>
          {[
            { color: "#f5f2ed", label: "Terrain surface" },
            { color: "#bbb5aa", label: "1m contour interval" },
            { color: "#e8e4de", label: "Road network" },
            { color: "#ffffff", label: "Building volumes" },
            { color: theme.warmAccent, label: "Selected building" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: item.color,
                  border: `1px solid ${theme.border}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 10, color: theme.dim, fontFamily: theme.mono }}>{item.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 14,
            background: "rgba(0,0,0,0.1)",
            borderRadius: 6,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: theme.dim,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
              fontFamily: theme.mono,
            }}
          >
            Controls
          </div>
          <div style={{ fontSize: 10, color: theme.dim, fontFamily: theme.mono, lineHeight: 1.8 }}>
            Left drag → Orbit
            <br />
            Right drag → Pan
            <br />
            Scroll → Zoom
            <br />
            Click → Select building
            <br />
            Delete → Remove selected
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${theme.border}`,
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, color: theme.dim, fontFamily: theme.mono }}>
            {buildingCount} buildings
          </span>
          <span style={{ fontSize: 8, color: theme.warmAccent, fontFamily: theme.mono }}>● prototype</span>
        </div>
      </div>
    </div>
  );
}
