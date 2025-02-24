export const SHARPNESS_DATA = {
  sharpness: {
    red: {
      label: "赤",
      phisical: 0.5,
      elemental: 0.25
    },
    orange: {
      label: "橙",
      phisical: 0.75,
      elemental: 0.5
    },
    yellow: {
      label: "黄",
      phisical: 1.0,
      elemental: 0.75
    },
    green: {
      label: "緑",
      phisical: 1.05,
      elemental: 1.0
    },
    blue: {
      label: "青",
      phisical: 1.2,
      elemental: 1.0625
    },
    white: {
      label: "白",
      phisical: 1.32,
      elemental: 1.125
    },
    purple: {
      label: "紫",
      phisical: 1.45,
      elemental: 1.2
    }
  }
} as const;

export type SharpnessKey = keyof typeof SHARPNESS_DATA.sharpness;
export type SharpnessLabel = typeof SHARPNESS_DATA.sharpness[SharpnessKey]['label'];
