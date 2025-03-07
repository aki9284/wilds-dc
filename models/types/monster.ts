export interface Effectiveness {
    slash: number
    impact: number
    shot: number
    fire: number
    water: number
    thunder: number
    ice: number
    dragon: number
}
  
export interface MonsterPart {
    name: string
    effectiveness: Effectiveness
    wounded?: boolean
}
  
export interface Monster {
    name: string
    parts: MonsterPart[]
}