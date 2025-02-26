import { atom } from 'jotai';
import { SelectedMotion } from '@/models/types/motion';

export const selectedMotionsAtom = atom<SelectedMotion[]>([
  { id: '1', motion: null }
]);
