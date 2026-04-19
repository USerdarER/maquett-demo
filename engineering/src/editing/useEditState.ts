import { createContext, useContext, useReducer, useMemo, type Dispatch, type ReactNode, createElement } from "react";
import { seedBuildings, type Building } from "../scene/buildings";

export type Vec2 = [number, number];
export type EditMode = "idle" | "draw";

export type EditState = {
  mode: EditMode;
  selectedId: string | null;
  buildings: Building[];
  drawPoints: Vec2[];
  floorCount: number;
};

export type EditAction =
  | { type: "select"; id: string }
  | { type: "deselect" }
  | { type: "deleteSelected" }
  | { type: "enterDrawMode" }
  | { type: "cancelDraw" }
  | { type: "addDrawPoint"; point: Vec2 }
  | { type: "setFloorCount"; n: number };

function clampFloors(n: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(20, Math.round(n)));
}

function reducer(state: EditState, action: EditAction): EditState {
  switch (action.type) {
    case "select": {
      if (state.mode !== "idle") return state;
      return { ...state, selectedId: action.id };
    }
    case "deselect": {
      if (state.selectedId === null) return state;
      return { ...state, selectedId: null };
    }
    case "deleteSelected": {
      if (!state.selectedId) return state;
      return {
        ...state,
        buildings: state.buildings.filter((b) => b.id !== state.selectedId),
        selectedId: null,
      };
    }
    case "enterDrawMode": {
      return { ...state, mode: "draw", selectedId: null, drawPoints: [] };
    }
    case "cancelDraw": {
      if (state.mode !== "draw") return state;
      return { ...state, mode: "idle", drawPoints: [] };
    }
    case "addDrawPoint": {
      if (state.mode !== "draw") return state;
      const drawPoints: Vec2[] = [...state.drawPoints, action.point];
      if (drawPoints.length < 2) return { ...state, drawPoints };
      const [p1, p2] = drawPoints;
      const w = Math.max(0.5, Math.abs(p1[0] - p2[0]));
      const d = Math.max(0.5, Math.abs(p1[1] - p2[1]));
      const newBuilding: Building = {
        id: crypto.randomUUID(),
        x: (p1[0] + p2[0]) / 2,
        z: (p1[1] + p2[1]) / 2,
        w,
        d,
        floors: state.floorCount,
      };
      return {
        ...state,
        buildings: [...state.buildings, newBuilding],
        drawPoints: [],
        mode: "idle",
      };
    }
    case "setFloorCount": {
      return { ...state, floorCount: clampFloors(action.n) };
    }
    default:
      return state;
  }
}

const initialState: EditState = {
  mode: "idle",
  selectedId: null,
  buildings: seedBuildings(),
  drawPoints: [],
  floorCount: 3,
};

type Ctx = { state: EditState; dispatch: Dispatch<EditAction> };

const EditStateContext = createContext<Ctx | null>(null);

export function EditStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo<Ctx>(() => ({ state, dispatch }), [state]);
  return createElement(EditStateContext.Provider, { value }, children);
}

export function useEditState(): Ctx {
  const ctx = useContext(EditStateContext);
  if (!ctx) throw new Error("useEditState must be used within EditStateProvider");
  return ctx;
}
