import { useEffect } from "react";
import type { Dispatch } from "react";
import type { EditAction, EditState } from "./useEditState";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export function useKeybindings(state: EditState, dispatch: Dispatch<EditAction>): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (state.mode === "draw") dispatch({ type: "cancelDraw" });
        if (state.selectedId !== null) dispatch({ type: "deselect" });
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (isEditableTarget(e.target)) return;
        if (state.selectedId !== null) {
          e.preventDefault();
          dispatch({ type: "deleteSelected" });
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.mode, state.selectedId, dispatch]);
}
