'use client'

import { useAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { Target, targetsAtom, selectedMonsterAtom, isEnragedAtom } from '@/atoms/targetAtoms'
import { SaveLoadPanel } from '../common/SaveLoadPanel'

interface Hitzone {
    slash: number
    impact: number
    shot: number
    fire: number
    water: number
    thunder: number
    ice: number
    dragon: number
}
  
interface MonsterPart {
    name: string
    hitzone: Hitzone
}
  
interface Monster {
    name: string
    parts: MonsterPart[]
}

export function TargetSelector() {
    const [monsters, setMonsters] = useState<Monster[]>([])
    const [selectedMonster, setSelectedMonster] = useAtom(selectedMonsterAtom)
    const [isEnraged, setIsEnraged] = useAtom(isEnragedAtom)
    const [targets, setTargets] = useAtom(targetsAtom)

    useEffect(() => {
      fetch('/data/monsters.json')
        .then(res => res.json())
        .then(data => {
          setMonsters(data.monsters)
          // 初期モンスターは selectedMonster が空の場合のみ設定
          if (data.monsters.length > 0 && selectedMonster === '') {
            setSelectedMonster(data.monsters[0].name)
          }
        })
    }, [])

    const addTarget = () => {
      const monster = monsters.find(m => m.name === selectedMonster)
      if (!monster) return

      // 未選択の部位を探す
      const availablePart = monster.parts.find(part => 
        !targets.some(t => t.partName === part.name)
      )

      if (!availablePart) return

      const newTarget: Target = {
        id: nanoid(),
        partName: availablePart.name,
        percentage: 0
      }
      setTargets([...targets, newTarget])
      adjustPercentages([...targets, newTarget])
    }

    const removeTarget = (id: string) => {
      const newTargets = targets.filter(t => t.id !== id)
      setTargets(newTargets)
      adjustPercentages(newTargets)
    }

    const updateTarget = (id: string, updates: Partial<Target>) => {
      const newTargets = targets.map(target => 
        target.id === id ? { ...target, ...updates } : target
      )
      setTargets(newTargets)
      if (updates.percentage !== undefined) {
        adjustPercentages(newTargets, id)
      }
    }

    const adjustPercentages = (targetList: Target[], excludeId?: string) => {
      // 100を超える値を持つターゲットを探す
      const overflowTarget = targetList.find(t => t.percentage > 100);
    
      if (overflowTarget) {
        // 100を超える値が見つかった場合の処理
        targetList.forEach(target => {
          if (target.id === overflowTarget.id) {
            target.percentage = 100;
          } else {
            target.percentage = 0;
          }
        });
      } else {
        // 通常の調整処理（100以下の場合）
        for (let i = targetList.length - 1; i >= 0; i--) {
          const currentTarget = targetList[i];
          if (currentTarget.id === excludeId) continue;
  
          const total = targetList.reduce((sum, t, index) => 
            index !== i ? sum + t.percentage : sum, 0
          );
  
          if (total < 100) {
            currentTarget.percentage = 100 - total;
            break;
          } else if (total > 100) {
            const diff = total - 100;
            if (currentTarget.percentage >= diff) {
              currentTarget.percentage -= diff;
              break;
            } else {
              currentTarget.percentage = 0;
              continue;
            }
          }
        }
      }
  
      setTargets([...targetList]);
    }

    return (
      <div className="flex gap-8">
        <div className="space-y-4 p-4">
          {/* モンスター選択（全体設定） */}
          <div className="flex items-center gap-4">
            <select
              value={selectedMonster}
              onChange={(e) => {
                setSelectedMonster(e.target.value)
                setTargets([]) // モンスター変更時にターゲットをリセット
              }}
              className="border rounded p-2"
            >
              {monsters.map(monster => (
                <option key={monster.name} value={monster.name}>
                  {monster.name}
                </option>
              ))}
            </select>

            {/* 怒り状態チェックボックス */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isEnraged}
                onChange={(e) => setIsEnraged(e.target.checked)}
                className="form-checkbox"
              />
              怒り状態
            </label>
          </div>

          <button
            onClick={addTarget}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            部位を追加
          </button>

          <div className="space-y-2">
            {targets.map((target) => (
              <div key={target.id} className="flex items-center gap-4 p-2 border rounded">
                <select
                  value={target.partName}
                  onChange={(e) => updateTarget(target.id, { partName: e.target.value })}
                  className="border rounded p-2"
                >
                  {monsters
                    .find(m => m.name === selectedMonster)
                    ?.parts
                    .filter(part => {
                      if (part.name === target.partName) return true
                      return !targets.some(t => 
                        t.id !== target.id && 
                        t.partName === part.name
                      )
                    })
                    .map(part => (
                      <option key={part.name} value={part.name}>
                        {part.name}
                      </option>
                    ))}
                </select>
        
                <input
                  type="number"
                  value={target.percentage}
                  onChange={(e) => updateTarget(target.id, { 
                    percentage: Math.max(0, Number(e.target.value))
                  })}
                  className="border rounded p-2 w-24"
                  min="0"
                  max="100"
                />
                <span>%</span>

                <button
                  onClick={() => removeTarget(target.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>

        <SaveLoadPanel
          storageKey="wilds-dc-targets"
          onSave={(name) => ({
            name,
            monster: selectedMonster,
            isEnraged,
            targets,
            description: selectedMonster // 表示用の説明
          })}
          onLoad={(saved) => {
            setSelectedMonster(saved.monster)
            setIsEnraged(saved.isEnraged)
            setTargets(saved.targets)
          }}
        />
      </div>
    )
  }