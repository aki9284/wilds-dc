export interface Motion {
  weaponType: string;
  name: string;
  value: string;
  damageType: string;
  duration: string;
}

export interface MotionSelection {
  id: string;
  motion: Motion | null;
}
