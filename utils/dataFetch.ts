import { Monster } from '@/models/types/monster';
import { Motion } from '@/models/types/motion';

// モンスターとモーションは後からどんどんデータ追加しそう＆DBに切り替える余地ありなので
// constで定義ではなくサーバからfetchするようにしておく
// ただこれらは計算ロジックであちこちから使うので、fetchはcalculatorのpage.tsxで最初に必ず行い、
// 他で使うときは同期処理でキャッシュ済みのデータを使うようにする
// ※キャッシュをメモリ上でなくlocalStorageにしている理由は開発中にホットリロードで毎回消えるのが面倒なため

const MONSTER_CACHE_KEY = 'cachedMonstersData';
const MOTION_CACHE_KEY = 'cachedMotionsData';
const CACHE_TIMESTAMP_KEY = 'cacheTimestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

function isCacheExpired(timestamp: number): boolean {
    return (Date.now() - timestamp) > CACHE_DURATION;
}

async function fetchData(url: string, cacheKey: string): Promise<any> {
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (cachedData && cacheTimestamp && !isCacheExpired(Number(cacheTimestamp))) {
        return JSON.parse(cachedData);
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }

    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    return data;
}

export async function fetchMonsterData(): Promise<Monster[]> {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/monsters.json`;
    return fetchData(url, MONSTER_CACHE_KEY);
}

export function getCachedMonsterData(): Monster[] {
    const cachedData = localStorage.getItem(MONSTER_CACHE_KEY);
    if (!cachedData) {
        throw new Error('Monsters data has not been initialized.');
    }
    return JSON.parse(cachedData);
}

export async function fetchMotionData(): Promise<Motion[]> {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const url = `${basePath}/data/motions.json`;
    return fetchData(url, MOTION_CACHE_KEY);
}

export function getCachedMotionData(): Motion[] {
    const cachedData = localStorage.getItem(MOTION_CACHE_KEY);
    if (!cachedData) {
        throw new Error('Motions data has not been initialized.');
    }
    return JSON.parse(cachedData);
}