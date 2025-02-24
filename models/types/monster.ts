export interface Resistance {
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
    resistance: Resistance
}
  
export interface Monster {
    name: string
    parts: MonsterPart[]
}