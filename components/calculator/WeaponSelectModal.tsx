'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { NamedWeaponData } from '@/models/types/weapon'
import { ELEMENT_TYPES } from '@/models/constants/damageTypes'


interface WeaponSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (weapon: NamedWeaponData) => void
}

export function WeaponSelectModal({ isOpen, onClose, onSelect }: WeaponSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [weapons, setWeapons] = useState<NamedWeaponData[]>([])

  useEffect(() => {
          const loadWeapons= async () => { 
              const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
              const weaponsResponse = await fetch(`${basePath}/data/weapons.json`)
              setWeapons(await weaponsResponse.json())
          }
          loadWeapons()
      }, [])


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-3xl bg-white rounded-lg p-6">
            <DialogTitle className="text-lg font-bold mb-4">武器を選択</DialogTitle>
          
            <input
              type="text"
              placeholder="武器名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="px-4 py-2">武器名</th>
                    <th className="px-4 py-2">攻撃力</th>
                    <th className="px-4 py-2">会心率</th>
                    <th className="px-4 py-2">属性</th>
                  </tr>
                </thead>
                <tbody>
                  {weapons
                    .filter(weapon => 
                      weapon.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(weapon => (
                      <tr 
                        key={weapon.id}
                        onClick={() => onSelect(weapon)}
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        <td className="px-4 py-2">{weapon.name}</td>
                        <td className="px-4 py-2 text-center">{weapon.stats.attack}</td>
                        <td className="px-4 py-2 text-center">{weapon.stats.affinity}%</td>
                        <td className="px-4 py-2 text-center">
                          {weapon.stats.elementType !== 'none' && 
                            `${ELEMENT_TYPES[weapon.stats.elementType].label} ${weapon.stats.elementValue}`
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </DialogPanel>
      </div>
    </Dialog>
  )
}
