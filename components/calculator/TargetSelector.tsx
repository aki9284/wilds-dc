'use client'

import { useAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { selectedTargetsAtom, selectedMonsterAtom } from '@/atoms/targetAtoms'
import { SelectedTarget } from '@/models/types/target'
import { SaveLoadPanel } from '../common/SaveLoadPanel'
import { Monster } from '@/models/types/monster'

export function TargetSelector() {
    const [monsters, setMonsters] = useState<Monster[]>([])
    const [selectedMonster, setSelectedMonster] = useAtom(selectedMonsterAtom)
    const [targets, setTargets] = useAtom(selectedTargetsAtom)

    useEffect(() => {
      fetch('/data/monsters.json')
        .then(res => res.json())
        .then(data => {
          setMonsters(data.monsters)
          if (data.monsters.length > 0 && selectedMonster === '') {
            setSelectedMonster(data.monsters[0].name)
          }
        })
    }, [])

    const addTarget = () => {
      const monster = monsters.find(m => m.name === selectedMonster)
      if (!monster) return

      const availablePart = monster.parts.find(part => 
        !targets.some(t => t.partName === part.name)
      )

      if (!availablePart) return

      const newTarget: SelectedTarget = {
        id: nanoid(),
        monsterName: selectedMonster,
        partName: availablePart.name,
        scarred: false,
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

    const updateTarget = (id: string, updates: Partial<SelectedTarget>) => {
      const newTargets = targets.map(target => 
        target.id === id ? { ...target, ...updates } : target
      )
      setTargets(newTargets)
      if (updates.percentage !== undefined) {
        adjustPercentages(newTargets, id)
      }
    }

    const adjustPercentages = (targetList: SelectedTarget[], excludeId?: string) => {
      const overflowTarget = targetList.find(t => t.percentage > 100);
    
      if (overflowTarget) {
        targetList.forEach(target => {
          if (target.id === overflowTarget.id) {
            target.percentage = 100;
          } else {
            target.percentage = 0;
          }
        });
      } else {
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
          <div className="flex items-center gap-4">
            <select
              value={selectedMonster}
              onChange={(e) => {
                setSelectedMonster(e.target.value)
                setTargets([])
              }}
              className="border rounded p-2"
            >
              {monsters.map(monster => (
                <option key={monster.name} value={monster.name}>
                  {monster.name}
                </option>
              ))}
            </select>
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

                <input
                  type="checkbox"
                  checked={target.scarred}
                  onChange={(e) => updateTarget(target.id, { scarred: e.target.checked })}
                  className="border rounded"
                />
                <span>傷</span>

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
          storageKey="target-settings"
          presetFilePath="/data/targetPresets.json"
          onSave={(name) => ({
            name,
            monster: selectedMonster,
            targets,
          })}
          onLoad={(saved) => {
            setSelectedMonster(saved.monster)
            setTargets(saved.targets)
          }}
        />
      </div>
    )
  }
