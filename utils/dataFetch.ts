import { Monster } from '@/models/types/monster';
import { Motion } from '@/models/types/motion';

let cachedMonstersData: Monster[] | null = null;
let cachedMotionsData: Motion[] | null = null;

// モンスターデータの事前取得と同期公開
export async function fetchMonsterData() {
    if (cachedMonstersData) {
        return cachedMonstersData;
    }

    const response = await fetch('/data/monsters.json');
    if (!response.ok) {
        throw new Error('Failed to fetch monsters data');
    }

    cachedMonstersData = await response.json();
    return cachedMonstersData;
}

export function getCachedMonsterData() {
    if (!cachedMonstersData) {
        throw new Error('Monsters data has not been initialized.');
    }
    return cachedMonstersData;
}


// モーションデータの事前取得と同期公開
export async function fetchMotionData() {
    if (cachedMotionsData) {
        return cachedMotionsData;
    }

    const response = await fetch('/data/motions.json');
    if (!response.ok) {
        throw new Error('Failed to fetch motions data');
    }

    cachedMotionsData = await response.json();
    return cachedMotionsData;
}

export function getCachedMotionData() {
    if (!cachedMotionsData) {
        throw new Error('Monsters data has not been initialized.');
    }
    return cachedMotionsData;
}