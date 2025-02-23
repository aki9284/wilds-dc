import { atom } from 'jotai';
import { MotionSelection } from '@/models/types/motion';

export const selectedMotionsAtom = atom<MotionSelection[]>([
  { id: '1', motion: null }
]);
