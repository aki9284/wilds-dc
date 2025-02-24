export interface Motion {
  weaponType: string;
  name: string;
  value: string;
  damageType: string;
  multiplyElement: number;
  duration: string;
}

export interface MotionSelection {
  id: string;
  motion: Motion | null;
}
