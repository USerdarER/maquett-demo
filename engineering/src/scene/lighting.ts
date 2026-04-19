import * as THREE from "three";

export type Lights = {
  ambient: THREE.AmbientLight;
  dirLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
};

export function createLights(): Lights {
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);

  const dirLight = new THREE.DirectionalLight(0xfff5e8, 1.6);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.left = -80;
  dirLight.shadow.camera.right = 80;
  dirLight.shadow.camera.top = 80;
  dirLight.shadow.camera.bottom = -80;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.bias = -0.001;

  const fillLight = new THREE.DirectionalLight(0xc8d8f0, 0.3);
  fillLight.position.set(-40, 20, -30);

  return { ambient, dirLight, fillLight };
}

export function updateSun(
  light: THREE.DirectionalLight,
  azimuthDeg: number,
  elevationDeg: number,
): void {
  const r = 80;
  const az = (azimuthDeg * Math.PI) / 180;
  const el = (elevationDeg * Math.PI) / 180;
  light.position.set(
    50 + r * Math.cos(el) * Math.sin(az),
    r * Math.sin(el),
    50 + r * Math.cos(el) * Math.cos(az),
  );
}
