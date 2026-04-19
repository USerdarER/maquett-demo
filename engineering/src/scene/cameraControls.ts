import * as THREE from "three";

export type CameraRefs = {
  theta: number;
  phi: number;
  dist: number;
  target: THREE.Vector3;
};

export type CameraControlsHandle = {
  dispose: () => void;
  updateCamera: () => void;
  setCursor: (cursor: string) => void;
};

export function attachCameraControls(
  domEl: HTMLElement,
  camera: THREE.PerspectiveCamera,
  refs: CameraRefs,
): CameraControlsHandle {
  const updateCamera = () => {
    const { theta, phi, dist, target } = refs;
    camera.position.set(
      target.x + dist * Math.sin(theta) * Math.cos(phi),
      target.y + dist * Math.sin(phi),
      target.z + dist * Math.cos(theta) * Math.cos(phi),
    );
    camera.lookAt(target);
  };

  const mouse = { down: false, x: 0, y: 0, button: 0 };
  let cursorIdle = "grab";

  const onDown = (ex: number, ey: number, button: number) => {
    mouse.down = true;
    mouse.x = ex;
    mouse.y = ey;
    mouse.button = button;
    domEl.style.cursor = button === 2 ? "move" : cursorIdle === "crosshair" ? "crosshair" : "grabbing";
  };

  const onUp = () => {
    mouse.down = false;
    domEl.style.cursor = cursorIdle;
  };

  const onMove = (ex: number, ey: number) => {
    if (!mouse.down) return;
    const dx = ex - mouse.x;
    const dy = ey - mouse.y;
    if (mouse.button === 2) {
      const right = new THREE.Vector3();
      camera.getWorldDirection(right);
      const up = new THREE.Vector3(0, 1, 0);
      right.cross(up).normalize();
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      refs.target.add(right.multiplyScalar(-dx * 0.15));
      refs.target.add(forward.multiplyScalar(dy * 0.15));
    } else {
      refs.theta -= dx * 0.004;
      refs.phi = Math.max(0.05, Math.min(Math.PI / 2.2, refs.phi + dy * 0.004));
    }
    mouse.x = ex;
    mouse.y = ey;
    updateCamera();
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    refs.dist = Math.max(20, Math.min(180, refs.dist + e.deltaY * 0.06));
    updateCamera();
  };

  const md = (e: MouseEvent) => onDown(e.clientX, e.clientY, e.button);
  const mm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
  const ts = (e: TouchEvent) => {
    const t = e.touches[0];
    onDown(t.clientX, t.clientY, 0);
  };
  const tm = (e: TouchEvent) => {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  };
  const ctx = (e: Event) => e.preventDefault();

  domEl.addEventListener("mousedown", md);
  domEl.addEventListener("contextmenu", ctx);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("mousemove", mm);
  domEl.addEventListener("touchstart", ts);
  window.addEventListener("touchend", onUp);
  window.addEventListener("touchmove", tm);
  domEl.addEventListener("wheel", onWheel, { passive: false });

  domEl.style.cursor = cursorIdle;

  return {
    dispose: () => {
      domEl.removeEventListener("mousedown", md);
      domEl.removeEventListener("contextmenu", ctx);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", mm);
      domEl.removeEventListener("touchstart", ts);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("touchmove", tm);
      domEl.removeEventListener("wheel", onWheel);
    },
    updateCamera,
    setCursor: (c: string) => {
      cursorIdle = c;
      if (!mouse.down) domEl.style.cursor = c;
    },
  };
}
