export const theme = {
  bg: "#1b1b22",
  panel: "#232330",
  border: "#2e2e3e",
  accent: "#c8c8c8",
  accentHi: "#ffffff",
  dim: "#6a6a7a",
  warmAccent: "#d4a574",
  warmAccentSoft: "rgba(212, 165, 116, 0.1)",
  sceneClear: 0xd8d8d8,
  sceneFog: 0xd8d8d8,
  platform: 0xf0ece6,
  terrain: 0xf5f2ed,
  contour: 0xbbb5aa,
  road: 0xe8e4de,
  building: 0xffffff,
  buildingSelected: 0xd4a574,
  edge: 0xd0ccc6,
  mono: `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace`,
} as const;

export type Theme = typeof theme;
