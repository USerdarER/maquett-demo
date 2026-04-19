import { useState } from "react";
import { EditStateProvider, useEditState } from "./editing/useEditState";
import { useKeybindings } from "./editing/keybindings";
import { TopoModel } from "./scene/TopoModel";
import { SceneControls } from "./ui/SceneControls";
import { Toolbar } from "./ui/Toolbar";
import { theme } from "./theme";

function AppShell() {
  const { state, dispatch } = useEditState();
  useKeybindings(state, dispatch);

  const [showBuildings, setShowBuildings] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [lightAngle, setLightAngle] = useState(45);
  const [lightElevation, setLightElevation] = useState(55);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: theme.bg,
        display: "flex",
        overflow: "hidden",
        fontFamily: `"Segoe UI", system-ui, sans-serif`,
      }}
    >
      <SceneControls
        showBuildings={showBuildings}
        setShowBuildings={setShowBuildings}
        showRoads={showRoads}
        setShowRoads={setShowRoads}
        showContours={showContours}
        setShowContours={setShowContours}
        lightAngle={lightAngle}
        setLightAngle={setLightAngle}
        lightElevation={lightElevation}
        setLightElevation={setLightElevation}
        buildingCount={state.buildings.length}
      />
      <div style={{ flex: 1, position: "relative" }}>
        <TopoModel
          showBuildings={showBuildings}
          showRoads={showRoads}
          showContours={showContours}
          lightAngle={lightAngle}
          lightElevation={lightElevation}
        />
        <Toolbar />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EditStateProvider>
      <AppShell />
    </EditStateProvider>
  );
}
